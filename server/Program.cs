using server;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=tasks.db"));
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

// GET all tasks
app.MapGet("/api/tasks", async (AppDbContext db) =>
    await db.Tasks.ToListAsync()
);

// GET task by id
app.MapGet("/api/tasks/{id}", async (int id, AppDbContext db) =>
    await db.Tasks.FindAsync(id) is server.Task task ? Results.Ok(task) : Results.NotFound()
);

// POST new task
app.MapPost("/api/tasks", async (server.Task task, AppDbContext db) =>
{
    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    return Results.Created($"/api/tasks/{task.Id}", task);
});

// PUT update task
app.MapPut("/api/tasks/{id}", async (int id, server.Task inputTask, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();
    task.Description = inputTask.Description;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETE task
app.MapDelete("/api/tasks/{id}", async (int id, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();
    db.Tasks.Remove(task);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();