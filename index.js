const express = require('express');
const consoleLoggerMiddleware = require('./consoleLoggerMiddleware');

const mysql = require('mysql');
const cors = require('cors');
const util = require('util');
const { Console } = require('console');
const moment = require('moment');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();

app.use(consoleLoggerMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbConfig = {
  host: '51.222.104.17',
  user: 'cdhproye_admin_dev',
  password: 'Prueba@protela2023',
  database: 'cdhproye_protela'
};

function actualizarFecha() {
  const dbConnection = mysql.createConnection(dbConfig);

  dbConnection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos', err);
      // Puedes realizar acciones adicionales aquí si la conexión falla
      return;
    }

    // Utilizar INSERT INTO ... ON DUPLICATE KEY UPDATE para insertar o actualizar la fecha
    dbConnection.query('INSERT INTO date_total (id, date) VALUES (1, NOW()) ON DUPLICATE KEY UPDATE date = NOW()', (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta', err);
        // Puedes realizar acciones adicionales aquí si la consulta falla
      } else {
        // console.log('Fecha actualizada correctamente');
      }

      dbConnection.end((endErr) => {
        if (endErr) {
          console.error('Error al cerrar la conexión', endErr);
        }
      }); // Cerrar la conexión después de ejecutar la consulta
    });
  });

  dbConnection.on('error', (err) => {
    console.error('Error en la conexión a la base de datos', err);
    // Puedes realizar acciones adicionales aquí si hay un error en la conexión
  });
}


// function logs(logData) {
//   const logDataStringified = JSON.stringify(logData);  // Convertimos el JSON a cadena para almacenarlo en la base de datos

//   const connection = mysql.createConnection(dbConfig);
//   connection.connect((err) => {
//     if (err) {
//       res.status(500).json({ error: 'Error de conexión a la base de datos' });
//       return;
//     }

//     // Construimos la consulta SQL para insertar en la tabla realtime_logs
//     const sql = `INSERT INTO logs (msg, procedencia) VALUES (?,?)`;
//     const values = [logDataStringified, "Backend"];

//     connection.query(sql, values, (err, result) => {
//       if (err) {
//         res.status(500).json({ error: 'Error al ejecutar la consulta de inserción' });
//         return;
//       }

//       connection.end(); // Cerrar la conexión después de enviar la respuesta

//       res.json({ message: 'Datos de log insertados con éxito' });
//     });
//   });
// }


const intervalo = 30000;
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

app.get('/TINTORERIA', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }
    
    connection.query('SELECT * FROM realtime_tintoreria_samples', (err, results) => {
      if (err) {
        logs({ error: err, originalUrl: req.originalUrl, status: 500, msg: 'Error al ejecutar la consulta' });
        // res.status(500).json({ error: 'Error al ejecutar la consulta' });  
        connection.end();      
        return;
      }
      results.forEach((element, index) => {

        if (element.power != 2) {
          const lastChangeDate = results[index].last_change_date;
          const horaActual = new Date(); // Obtener la hora actual
          const tiempoTranscurridoEnMinutos = Math.round((horaActual - lastChangeDate) / (1000 * 60));
          const horas = Math.floor(tiempoTranscurridoEnMinutos / 60);
          const minutos = tiempoTranscurridoEnMinutos % 60;
          const respuesta = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
          results[index]["tiempoTranscurridoEnMinutos"] = tiempoTranscurridoEnMinutos;
          
        }

      });
      

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
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
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
          "RASCHEL": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
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
          "URDIDOS": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
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
          "CIRCULARES": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
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
          "TINTORERIA": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
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
          "RAMAS": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.post('/especific_machine', (req, res) => {

  const id_machine = req.body.id_machine;

  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    let respuesta = [{}]

    if (req.body.sala == "TRICOT") {
      connection.query('SELECT * FROM realtime_tricot_samples WHERE id_m =' + id_machine, (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Error al ejecutar la consulta' });
          return;
        }

        const lastChangeDate = results[0].last_change_date;
        const horaActual = new Date(); // Obtener la hora actual
        const tiempoTranscurridoEnMinutos = Math.round((horaActual - lastChangeDate) / (1000 * 60));
        const horas = Math.floor(tiempoTranscurridoEnMinutos / 60);
        const minutos = tiempoTranscurridoEnMinutos % 60;
        const respuesta = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

        connection.end(); // Cerrar la conexión después de enviar la respuesta

        // res.json(respuesta);
        results[0]["tiempo_trascurrido"] = respuesta;
        // console.log(results);

        res.json(results);
      });
    }
    if (req.body.sala == "TINTORERIA") {
      connection.query('SELECT * FROM realtime_tintoreria_samples WHERE id_m =' + id_machine, (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Error al ejecutar la consulta' });
          return;
        }

        const lastChangeDate = results[0].last_change_date;
        const horaActual = new Date(); // Obtener la hora actual
        const tiempoTranscurridoEnMinutos = Math.round((horaActual - lastChangeDate) / (1000 * 60));
        const horas = Math.floor(tiempoTranscurridoEnMinutos / 60);
        const minutos = tiempoTranscurridoEnMinutos % 60;
        // const respuesta = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        const respuesta = tiempoTranscurridoEnMinutos;

        connection.end(); // Cerrar la conexión después de enviar la respuesta

        // res.json(respuesta);
        results[0]["tiempo_trascurrido"] = respuesta;
        // console.log(respuesta);

        res.json(results);
      });
    }

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
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

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
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

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


      let eficiencia = 0;
      let num_maq_total = 0;
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
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

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
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

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


      let eficiencia = 0;
      let eficiencia_dia = 0;
      let eficiencia_proceso = 0;
      let num_maq_total = 0;
      let maq_on = 0;
      let body = 0;
      let maq_desconexion = 0;

      const fechaActual = moment();
      let kg_dia = 0;

      if (results.length > 0) {
        results.forEach(element => {
          if (element.power == 2) {
            maq_on++;
            eficiencia += element.eficiencia_turno;
            eficiencia_dia += element.eficiencia;
            eficiencia_proceso += element.eficiencia_proceso;
            if (element.rpm) {
              body += element.rpm;
            }
          }
          if (element.power == 3 || element.power == 1) {
            eficiencia += element.eficiencia_turno;
            eficiencia_dia += element.eficiencia;
            eficiencia_proceso += element.eficiencia_proceso;
          }
          if (element.power != 0) {
            num_maq_total++;
          }
          if (element.power == 0) {
            maq_desconexion++;
          }

          const nuevaFecha = fechaActual.clone().add(parseInt(element.timetoend), 'minutes');

          if (fechaActual.isSame(nuevaFecha, 'day') && element.dyelotrefno) {
            kg_dia += element.weight;
          }

        });
      }

      const respuesta = [
        {
          "TINTORERIA": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body / maq_on).toFixed(0)),
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
            "eficiencia_dia": isNaN(eficiencia_dia / num_maq_total) ? "..." : (eficiencia_dia / num_maq_total).toFixed(0),
            "eficiencia_proceso": isNaN(eficiencia_proceso / num_maq_total) ? "..." : (eficiencia_proceso / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion,
            "kg_dia": kg_dia
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

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
            "eficiencia": isNaN(eficiencia / num_maq_total) ? "..." : (eficiencia / num_maq_total).toFixed(0),
            "maq_desconexion": maq_desconexion
          }
        }
      ];

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json(respuesta);
    });
  });
});

app.get('/HISTORICOS', (req, res) => { //////////PRUEBAS PARA HISTORICOS PERO TOCA CAMBIARLO POR UNA PETICION DE TIPO POST PARA SELECCIONAR RANGO DE FECHAS.
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    connection.query('SELECT * FROM historicos', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }
      console.log(results[0]["data_json"])
      res.json(results[0]["data_json"]);
      connection.end(); // Cerrar la conexión después de enviar la respuesta
    });
  });
});


//peticiones post para logs
app.post('/logs', (req, res) => {
  const logData = JSON.stringify(req.body);  // Convertimos el JSON a cadena para almacenarlo en la base de datos

  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      res.status(500).json({ error: 'Error de conexión a la base de datos' });
      return;
    }

    // Construimos la consulta SQL para insertar en la tabla realtime_logs
    const sql = `INSERT INTO logs (msg, procedencia) VALUES (?,?)`;
    const values = [logData, "Frontend"];

    connection.query(sql, values, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error al ejecutar la consulta de inserción' });
        return;
      }

      connection.end(); // Cerrar la conexión después de enviar la respuesta

      res.json({ message: 'Datos de log insertados con éxito' });
    });
  });
});







app.listen(port, '0.0.0.0', () => {
  console.log('Servidor iniciado en el puerto ' + port);
});

