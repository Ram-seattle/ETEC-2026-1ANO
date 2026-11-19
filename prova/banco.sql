CREATE TABLE IF NOT EXISTS pokemon (
  id INT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  img TEXT,
  cp INT,
  treinador VARCHAR(50)
)

--listar baralho salvo e ordenar pelo ID

--conta quantos pokemons estao no baralho
SELECT COUNT(*):: int AS total FROM pokemon

ALTER TABLE pokemons ADD COLUMN tipo1 VARCHAR(20) NOT NULL, ADD COLUMN tipo2 VARCHAR(20)