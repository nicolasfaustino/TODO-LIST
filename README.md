# TODO-List (aplicação exemplo)

Este repositório contém a estrutura para uma aplicação de lista de tarefas (todo-list) com:

- Backend: API REST em C# (.NET) usando Entity Framework Core e SQLite
- Frontend: HTML, CSS e JavaScript (consumindo a API)

Objetivo: permitir criar, listar, editar e deletar tarefas (CRUD) através de endpoints HTTP (GET / POST / PUT / DELETE) e de uma interface web simples.

## Stack principal

- C# / .NET (recomendado .NET 7 ou 8)
- Entity Framework Core (EF Core) para mapeamento objeto-relacional
- SQLite (arquivo local, ex: `todos.db`)
- HTML, CSS e JavaScript para o cliente

## Estrutura esperada de pastas

- `server/` — API ASP.NET Core Web API (projeto C#)
- `client/` — frontend estático (ex: `index.html`, `style.css`, `app.js`) que consome a API

> Observação: no repositório atual as pastas `server/` e `client/` estão vazias; este README documenta o que será implementado.

## Licença

Este projeto pode ser disponibilizado sob MIT (ou outra licença, conforme preferir).

a