import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'advogados',
};

// Advogados
app.get('/api/advogados', async (req, res) => {
  try {
    let query = 'SELECT * FROM advogados WHERE 1=1';
    const params = [];

    if (req.query.conselho && req.query.conselho !== 'Selecionar') {
      query += ' AND conselho = ?';
      params.push(req.query.conselho);
    }
    if (req.query.cedula) {
      query += ' AND registo = ?';
      params.push(req.query.cedula);
    }
    if (req.query.name) {
      query += ' AND name LIKE ?';
      params.push(`%${req.query.name}%`);
    }
    if (req.query.morada) {
      query += ' AND morada LIKE ?';
      params.push(`%${req.query.morada}%`);
    }
    if (req.query.localidade) {
      query += ' AND localidade = ?';
      params.push(req.query.localidade);
    }
    if (req.query.codigoPostal) {
      query += ' AND codigo_postal = ?';
      params.push(req.query.codigoPostal);
    }

    // Ordering
    let orderByColumn = 'name'; // Default order by name
    if (req.query.ordenarPor) {
      switch (req.query.ordenarPor) {
        case 'cedula':
          orderByColumn = 'registo';
          break;
        case 'name':
          orderByColumn = 'name';
          break;
        case 'morada':
          orderByColumn = 'morada';
          break;
        case 'codigoPostal':
          orderByColumn = 'codigo_postal';
          break;
        case 'localidade':
          orderByColumn = 'localidade';
          break;
        default:
          orderByColumn = 'name';
      }
    }

    const orderDirection = (req.query.ordenacao === 'desc') ? 'DESC' : 'ASC';
    query += ` ORDER BY ${orderByColumn} ${orderDirection}`;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sociedades
app.get('/api/sociedades', async (req, res) => {
  try {
    let query = 'SELECT * FROM sociedades WHERE 1=1';
    const params = [];

    if (req.query.conselhoRegional && req.query.conselhoRegional !== 'Selecionar') {
      query += ' AND conselho = ?';
      params.push(req.query.conselhoRegional);
    }
    if (req.query.numero || req.query.nome) {
      if (req.query.numero && req.query.nome) {
        query += ' AND (registo = ? OR name LIKE ?)';
        params.push(req.query.numero, `%${req.query.nome}%`);
      } else if (req.query.numero) {
        query += ' AND registo = ?';
        params.push(req.query.numero);
      } else if (req.query.nome) {
        query += ' AND name LIKE ?';
        params.push(`%${req.query.nome}%`);
      }
    }
    if (req.query.morada || req.query.localidade || req.query.codigoPostal) {
      let subQuery = [];
      if (req.query.morada) {
        subQuery.push('morada LIKE ?');
        params.push(`%${req.query.morada}%`);
      }
      if (req.query.localidade) {
        subQuery.push('localidade = ?');
        params.push(req.query.localidade);
      }
      if (req.query.codigoPostal) {
        subQuery.push('codigo_postal = ?');
        params.push(req.query.codigoPostal);
      }
      if (subQuery.length > 0) {
        query += ' AND (' + subQuery.join(' OR ') + ')';
      }
    }

    // Ordering
    let orderByColumn = 'registo'; // Default order by registo
    if (req.query.ordenarPor) {
      switch (req.query.ordenarPor) {
        case 'registo':
          orderByColumn = 'registo';
          break;
        case 'nome':
          orderByColumn = 'name';
          break;
        case 'morada':
          orderByColumn = 'morada';
          break;
        case 'codigoPostal':
          orderByColumn = 'codigo_postal';
          break;
        case 'localidade':
          orderByColumn = 'localidade';
          break;
        default:
          orderByColumn = 'registo';
      }
    }

    const orderDirection = (req.query.ordenacao === 'desc') ? 'DESC' : 'ASC';
    query += ` ORDER BY ${orderByColumn} ${orderDirection}`;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All Sociedades (Alphabetical)
app.get('/api/all-sociedades', async (req, res) => {
  try {
    let query = 'SELECT * FROM sociedades';
    const params = [];

    if (req.query.letter && req.query.letter !== 'all') {
      query += ' WHERE name LIKE ?';
      params.push(`${req.query.letter}%`);
    }

    query += ' ORDER BY name ASC';

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Estagiarios
app.get('/api/estagiarios', async (req, res) => {
  try {
    let query = 'SELECT * FROM estagiarios WHERE 1=1';
    const params = [];

    if (req.query.conselho && req.query.conselho !== 'Selecionar') {
      query += ' AND conselho = ?';
      params.push(req.query.conselho);
    }
    if (req.query.cedula || req.query.nome) {
      if (req.query.cedula && req.query.nome) {
        query += ' AND (cedula = ? OR name LIKE ?)';
        params.push(req.query.cedula, `%${req.query.nome}%`);
      } else if (req.query.cedula) {
        query += ' AND cedula = ?';
        params.push(req.query.cedula);
      } else if (req.query.nome) {
        query += ' AND name LIKE ?';
        params.push(`%${req.query.nome}%`);
      }
    }
    if (req.query.morada || req.query.localidade || req.query.codigoPostal) {
      let subQuery = [];
      if (req.query.morada) {
        subQuery.push('morada LIKE ?');
        params.push(`%${req.query.morada}%`);
      }
      if (req.query.localidade) {
        subQuery.push('localidade = ?');
        params.push(req.query.localidade);
      }
      if (req.query.codigoPostal) {
        subQuery.push('codigo_postal = ?');
        params.push(req.query.codigoPostal);
      }
      if (subQuery.length > 0) {
        query += ' AND (' + subQuery.join(' OR ') + ')';
      }
    }

    // Ordering
    let orderByColumn = 'name';
    if (req.query.ordenarPor) {
      switch (req.query.ordenarPor) {
        case 'cedula':
          orderByColumn = 'cedula';
          break;
        case 'nome':
          orderByColumn = 'name';
          break;
        case 'morada':
          orderByColumn = 'morada';
          break;
        case 'codigoPostal':
          orderByColumn = 'codigo_postal';
          break;
        case 'localidade':
          orderByColumn = 'localidade';
          break;
        default:
          orderByColumn = 'name';
      }
    }

    const orderDirection = (req.query.ordenacao === 'desc') ? 'DESC' : 'ASC';
    query += ` ORDER BY ${orderByColumn} ${orderDirection}`;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All Estagiarios (Alphabetical)
app.get('/api/all-estagiarios', async (req, res) => {
  try {
    let query = 'SELECT * FROM estagiarios';
    const params = [];

    if (req.query.letter && req.query.letter !== 'all') {
      query += ' WHERE name LIKE ?';
      params.push(`${req.query.letter}%`);
    }

    query += ' ORDER BY name ASC';

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All Advogados (Alphabetical)
app.get('/api/all-advogados', async (req, res) => {
  try {
    let query = 'SELECT * FROM advogados';
    const params = [];

    if (req.query.letter && req.query.letter !== 'all') {
      query += ' WHERE name LIKE ?';
      params.push(`${req.query.letter}%`);
    }

    query += ' ORDER BY name ASC';

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tribunais
app.get('/api/tribunais', async (req, res) => {
  try {
    let query = 'SELECT * FROM tribunais WHERE 1=1';
    const params = [];

    if (req.query.nome) {
      query += ' AND Nome LIKE ?';
      params.push(`%${req.query.nome}%`);
    }
    if (req.query.morada) {
      query += ' AND Morada LIKE ?';
      params.push(`%${req.query.morada}%`);
    }
    if (req.query.email) {
      query += ' AND Email LIKE ?';
      params.push(`%${req.query.email}%`);
    }
    if (req.query.tipo) {
      query += ' AND Tipo = ?';
      params.push(req.query.tipo);
    }

    // Ordering
    let orderByColumn = 'Nome'; // Default order by Nome
    if (req.query.ordenarPor) {
      switch (req.query.ordenarPor) {
        case 'nome':
          orderByColumn = 'Nome';
          break;
        case 'morada':
          orderByColumn = 'Morada';
          break;
        case 'email':
          orderByColumn = 'Email';
          break;
        default:
          orderByColumn = 'Nome';
      }
    }

    const orderDirection = (req.query.ordenacao === 'desc') ? 'DESC' : 'ASC';
    query += ` ORDER BY ${orderByColumn} ${orderDirection}`;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All Tribunais (Alphabetical)
app.get('/api/all-tribunais', async (req, res) => {
  try {
    let query = 'SELECT * FROM tribunais';
    const params = [];

    if (req.query.letter && req.query.letter !== 'all') {
      query += ' WHERE Nome LIKE ?';
      params.push(`${req.query.letter}%`);
    }

    query += ' ORDER BY Nome ASC';

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for searching by location across all tables
app.get('/api/search-by-location', async (req, res) => {
  const { localidade } = req.query;

  if (!localidade) {
    return res.status(400).json({ error: 'O parâmetro "localidade" é obrigatório.' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const searchQuery = `%${localidade}%`;

    const query = `
      (SELECT id, name, morada, localidade, codigo_postal, 'advogado' as tipo FROM advogados WHERE localidade LIKE ?)
      UNION ALL
      (SELECT id, name, morada, localidade, codigo_postal, 'sociedade' as tipo FROM sociedades WHERE localidade LIKE ?)
      UNION ALL
      (SELECT id, name, morada, localidade, codigo_postal, 'estagiario' as tipo FROM estagiarios WHERE localidade LIKE ?)
      UNION ALL
      (SELECT ID as id, Nome as name, Morada as morada, Morada as localidade, '' as codigo_postal, 'tribunal' as tipo FROM tribunais WHERE Morada LIKE ?)
    `;
    
    const [rows] = await connection.execute(query, [searchQuery, searchQuery, searchQuery, searchQuery]);
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error('Search by location error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
}); 