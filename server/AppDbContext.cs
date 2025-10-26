using Microsoft.EntityFrameworkCore;
using server;

namespace server;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Task> Tasks => Set<Task>();
}