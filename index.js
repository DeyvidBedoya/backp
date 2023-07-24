const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const util = require('util');
const { Console } = require('console');

const port = process.env.PORT || 3000;

const app = express();

const dbConfig = {
  host: '51.222.104.17',
  user: 'cdhproye_admin_dev',
  password: 'Prueba@protela2023',
  database: 'cdhproye_protela'
};

app.use(cors()); // Usar el middleware cors

app.get('/datos', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    connection.query('SELECT * FROM realtime_tricot_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }

      res.json(results);
      connection.end(); // Cerrar la conexión después de enviar la respuesta
    });
  });
});

app.get('/TRICOT', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    connection.query('SELECT * FROM realtime_tricot_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }

      res.json(results);
      connection.end(); // Cerrar la conexión después de enviar la respuesta
    });
  });
});

app.get('/RASCHEL', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    connection.query('SELECT * FROM realtime_raschel_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }

      res.json(results);
      connection.end(); // Cerrar la conexión después de enviar la respuesta
    });
  });
});

app.get('/CIRCULARES', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    connection.query('SELECT * FROM realtime_circulares_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }

      res.json(results);
      connection.end(); // Cerrar la conexión después de enviar la respuesta
    });
  });
});

app.get('/RAMAS', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    connection.query('SELECT * FROM realtime_ramas_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }

      res.json(results);
      connection.end(); // Cerrar la conexión después de enviar la respuesta
    });
  });
});

app.get('/URDIDOS', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    connection.query('SELECT * FROM realtime_urdidos_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }

      res.json(results);
      connection.end(); // Cerrar la conexión después de enviar la respuesta
    });
  });
});

app.get('/general_dashboard_alamos', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    connection.query('SELECT * FROM dashboard_alamos', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }

      res.json(results);
      connection.end(); // Cerrar la conexión después de enviar la respuesta
    });
  });
});

app.get('/general', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]


    connection.query('SELECT * FROM realtime_tricot_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }


      let eficiencia = 0;
      let num_maq_total = 0;
      let maq_on = 0;
      let body = 0;
      let maq_desconexion = 0;


      results.forEach(element => {
        if (element.power == 2) {
          maq_on++;
          eficiencia += element.eficiencia;
          if (element.rpm) {
            body += element.rpm;
          }
        }
        if (element.power == 3 || element.power == 1) {
          eficiencia += element.eficiencia;
        }
        if (element.power != 0) {
          num_maq_total++;
        }
        if (element.power == 0) {
          maq_desconexion++;
        }
      });

      const respuesta = [
        {
          "TRICOT": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.get('/general_TRICOT', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]


    connection.query('SELECT * FROM realtime_tricot_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }


      let eficiencia = 0;
      let num_maq_total = 0;
      let maq_on = 0;
      let body = 0;
      let maq_desconexion = 0;


      if (results.length > 0) {
        results.forEach(element => {
          if (element.power == 2) {
            maq_on++;
            eficiencia += element.eficiencia;
            if (element.rpm) {
              body += element.rpm;
            }
          }
          if (element.power == 3 || element.power == 1) {
            eficiencia += element.eficiencia;
          }
          if (element.power != 0) {
            num_maq_total++;
          }
          if (element.power == 0) {
            maq_desconexion++;
          }
        });
      }

      const respuesta = [
        {
          "TRICOT": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.get('/general_RASCHEL', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]


    connection.query('SELECT * FROM realtime_raschel_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }


      let eficiencia = 200;
      let num_maq_total = 10;
      let maq_on = 22;
      let body = 0;
      let maq_desconexion = 0;

      if (results.length > 0) {
        results.forEach(element => {
          if (element.power == 2) {
            maq_on++;
            eficiencia += element.eficiencia;
            if (element.rpm) {
              body += element.rpm;
            }
          }
          if (element.power == 3 || element.power == 1) {
            eficiencia += element.eficiencia;
          }
          if (element.power != 0) {
            num_maq_total++;
          }
          if (element.power == 0) {
            maq_desconexion++;
          }
        });
      }

      const respuesta = [
        {
          "RASCHEL": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.get('/general_URDIDOS', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]


    connection.query('SELECT * FROM realtime_urdidos_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }


      let eficiencia = 300;
      let num_maq_total = 30;
      let maq_on = 33;
      let body = 0;
      let maq_desconexion = 0;

      if (results.length > 0) {
        results.forEach(element => {
          if (element.power == 2) {
            maq_on++;
            eficiencia += element.eficiencia;
            if (element.rpm) {
              body += element.rpm;
            }
          }
          if (element.power == 3 || element.power == 1) {
            eficiencia += element.eficiencia;
          }
          if (element.power != 0) {
            num_maq_total++;
          }
          if (element.power == 0) {
            maq_desconexion++;
          }
        });
      }

      const respuesta = [
        {
          "URDIDOS": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.get('/general_CIRCULARES', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]


    connection.query('SELECT * FROM realtime_circulares_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }


      let eficiencia = 400;
      let num_maq_total = 10;
      let maq_on = 44;
      let body = 0;
      let maq_desconexion = 0;

      if (results.length > 0) {
        results.forEach(element => {
          if (element.power == 2) {
            maq_on++;
            eficiencia += element.eficiencia;
            if (element.rpm) {
              body += element.rpm;
            }
          }
          if (element.power == 3 || element.power == 1) {
            eficiencia += element.eficiencia;
          }
          if (element.power != 0) {
            num_maq_total++;
          }
          if (element.power == 0) {
            maq_desconexion++;
          }
        });
      }

      const respuesta = [
        {
          "CIRCULARES": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.get('/general_TINTORERIA', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]


    connection.query('SELECT * FROM realtime_tintoreria_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }


      let eficiencia = 500;
      let num_maq_total = 10;
      let maq_on = 55;
      let body = 0;
      let maq_desconexion = 0;

      if (results.length > 0) {
        results.forEach(element => {
          if (element.power == 2) {
            maq_on++;
            eficiencia += element.eficiencia;
            if (element.rpm) {
              body += element.rpm;
            }
          }
          if (element.power == 3 || element.power == 1) {
            eficiencia += element.eficiencia;
          }
          if (element.power != 0) {
            num_maq_total++;
          }
          if (element.power == 0) {
            maq_desconexion++;
          }
        });
      }

      const respuesta = [
        {
          "TINTORERIA": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.get('/general_RAMAS', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]


    connection.query('SELECT * FROM realtime_ramas_samples', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }


      let eficiencia = 600;
      let num_maq_total = 6;
      let maq_on = 66;
      let body = 0;
      let maq_desconexion = 0;

      if (results.length > 0) {
        results.forEach(element => {
          if (element.power == 2) {
            maq_on++;
            eficiencia += element.eficiencia;
            if (element.rpm) {
              body += element.rpm;
            }
          }
          if (element.power == 3 || element.power == 1) {
            eficiencia += element.eficiencia;
          }
          if (element.power != 0) {
            num_maq_total++;
          }
          if (element.power == 0) {
            maq_desconexion++;
          }
        });
      }

      const respuesta = [
        {
          "RAMAS": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];      

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log('Servidor iniciado en el puerto' + port);
});

