const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const util = require('util');
const { Console } = require('console');

const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbConfig = {
  host: '51.222.104.17',
  user: 'cdhproye_admin_dev',
  password: 'Prueba@protela2023',
  database: 'cdhproye_protela_produccion'
};

function actualizarFecha() {
  const dbConnection = mysql.createConnection(dbConfig); // Reemplaza dbConfig con tu configuración de conexión a la base de datos
  dbConnection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos', err);
      return;
    }

    // Utilizar INSERT INTO ... ON DUPLICATE KEY UPDATE para insertar o actualizar la fecha
    dbConnection.query('INSERT INTO date_total (id, date) VALUES (1, NOW()) ON DUPLICATE KEY UPDATE date = NOW()', (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta', err);
      } else {
        // console.log('Fecha actualizada correctamente');
      }

      dbConnection.end(); // Cerrar la conexión después de ejecutar la consulta
    });
  });
}

const intervalo = 30000; // 1 minuto en milisegundos
setInterval(actualizarFecha, intervalo);

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

      if (results.length > 0) {
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
      }
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

      if (results.length > 0) {
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
      }
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

      if (results.length > 0) {
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
      }
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

      if (results.length > 0) {
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
      }
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

      if (results.length > 0) {
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
      }
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

      if (results.length > 0) {
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
      }
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

      if (results.length > 0) {
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
      }
      res.json(respuesta);
    });
  });
});

app.post('/especific_machine', (req, res) => {
  // Aquí puedes procesar los datos recibidos desde el frontend
  const id_machine = req.body.id_machine; // Suponiendo que el frontend envía un objeto con una propiedad 'id'
  // console.log(numero);
  // Realiza las operaciones necesarias con el ID recibido

  // Devuelve una respuesta al frontend (opcional)
  // res.json(numero);

  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]

    connection.query('SELECT * FROM realtime_tricot_samples WHERE id_m =' + id_machine, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }
      if (results.length > 0) {
        const lastChangeDate = results[0].last_change_date;
        const horaActual = new Date(); // Obtener la hora actual
        const tiempoTranscurridoEnMinutos = Math.round((horaActual - lastChangeDate) / (1000 * 60));
        const horas = Math.floor(tiempoTranscurridoEnMinutos / 60);
        const minutos = tiempoTranscurridoEnMinutos % 60;
        const respuesta = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

        connection.end(); // Cerrar la conexión después de enviar la respuesta

        // res.json(respuesta);
        results[0]["tiempo_trascurrido"] = respuesta;
        // console.log(results[0]);
      }
      res.json(results);
    });
  });

});

app.get('/general_TRICOT_turno', (req, res) => {
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

      if (results.length > 0) {
        let eficiencia = 0;
        let num_maq_total = 0;
        let maq_on = 0;
        let body = 0;
        let maq_desconexion = 0;


        if (results.length > 0) {
          results.forEach(element => {
            if (element.power == 2) {
              maq_on++;
              eficiencia += element.eficiencia_turno;
              if (element.rpm) {
                body += element.rpm;
              }
            }
            if (element.power == 3 || element.power == 1) {
              eficiencia += element.eficiencia_turno;
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
      }
      res.json(respuesta);
    });
  });
});

app.get('/general_RASCHEL_turno', (req, res) => {
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

      if (results.length > 0) {
        let eficiencia = 200;
        let num_maq_total = 10;
        let maq_on = 22;
        let body = 0;
        let maq_desconexion = 0;

        if (results.length > 0) {
          results.forEach(element => {
            if (element.power == 2) {
              maq_on++;
              eficiencia += element.eficiencia_turno;
              if (element.rpm) {
                body += element.rpm;
              }
            }
            if (element.power == 3 || element.power == 1) {
              eficiencia += element.eficiencia_turno;
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
      }
      res.json(respuesta);
    });
  });
});

app.get('/general_URDIDOS_turno', (req, res) => {
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

      if (results.length > 0) {
        let eficiencia = 300;
        let num_maq_total = 30;
        let maq_on = 33;
        let body = 0;
        let maq_desconexion = 0;

        if (results.length > 0) {
          results.forEach(element => {
            if (element.power == 2) {
              maq_on++;
              eficiencia += element.eficiencia_turno;
              if (element.rpm) {
                body += element.rpm;
              }
            }
            if (element.power == 3 || element.power == 1) {
              eficiencia += element.eficiencia_turno;
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
      }
      res.json(respuesta);
    });
  });
});

app.get('/general_CIRCULARES_turno', (req, res) => {
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

      if (results.length > 0) {
        let eficiencia = 400;
        let num_maq_total = 10;
        let maq_on = 44;
        let body = 0;
        let maq_desconexion = 0;

        if (results.length > 0) {
          results.forEach(element => {
            if (element.power == 2) {
              maq_on++;
              eficiencia += element.eficiencia_turno;
              if (element.rpm) {
                body += element.rpm;
              }
            }
            if (element.power == 3 || element.power == 1) {
              eficiencia += element.eficiencia_turno;
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
      }
      res.json(respuesta);
    });
  });
});

app.get('/general_TINTORERIA_turno', (req, res) => {
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

      if (results.length > 0) {
        let eficiencia = 500;
        let num_maq_total = 10;
        let maq_on = 55;
        let body = 0;
        let maq_desconexion = 0;

        if (results.length > 0) {
          results.forEach(element => {
            if (element.power == 2) {
              maq_on++;
              eficiencia += element.eficiencia_turno;
              if (element.rpm) {
                body += element.rpm;
              }
            }
            if (element.power == 3 || element.power == 1) {
              eficiencia += element.eficiencia_turno;
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
      }
      res.json(respuesta);
    });
  });
});

app.get('/general_RAMAS_turno', (req, res) => {
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

      if (results.length > 0) {
        let eficiencia = 600;
        let num_maq_total = 6;
        let maq_on = 66;
        let body = 0;
        let maq_desconexion = 0;

        if (results.length > 0) {
          results.forEach(element => {
            if (element.power == 2) {
              maq_on++;
              eficiencia += element.eficiencia_turno;
              if (element.rpm) {
                body += element.rpm;
              }
            }
            if (element.power == 3 || element.power == 1) {
              eficiencia += element.eficiencia_turno;
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
      }
      res.json(respuesta);
    });
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log('Servidor iniciado en el puerto' + port);
});

