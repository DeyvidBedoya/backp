const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const util = require('util');

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
        if(element.power == 0){
          maq_desconexion++;
        }     
      });

      const respuesta = [
        {
          "TRICOT": {
            "num_maq_total": num_maq_total,
            "maq_on": maq_on,
            "body": Number((body/maq_on).toFixed(0)),
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

// app.get('/general', async (req, res) => {
//   try {
//     const connection = mysql.createConnection(dbConfig);
//     const connect = util.promisify(connection.connect).bind(connection);
//     const query = util.promisify(connection.query).bind(connection);

//     await connect();

//     const resultsPromises = [
//       query('SELECT * FROM realtime_tricot_samples'),
//       query('SELECT * FROM realtime_urdidos_samples'),
//       query('SELECT * FROM realtime_raschel_samples'),
//       query('SELECT * FROM realtime_circulares_samples'),
//       query('SELECT * FROM realtime_tintoreria_samples'),
//       query('SELECT * FROM realtime_ramas_samples')
//     ];

//     const results = await Promise.all(resultsPromises);

//     let respuesta = [{}];

//     const tablas = [
//       'TRICOT',
//       'URDIDOS',
//       'RASCHEL',
//       'CIRCULARES',
//       'TINTORERIA',
//       'RAMAS'
//     ];    

//     results.forEach((result, index) => {
//       let eficiencia = 0;
//       let num_maq_total = 0;
//       let maq_on = 0;
//       let body = 0;
//       let maq_desconexion = 0;

//       result.forEach(element => {
//         if (element.power == 2) {
//           maq_on++;
//           eficiencia += element.eficiencia;
//           if (element.rpm) {
//             body += element.rpm;
//           }
//         }
//         if (element.power == 3 || element.power == 1) {
//           eficiencia += element.eficiencia;
//         }
//         if (element.power != 0) {
//           num_maq_total++;
//         }
//         if (element.power == 0) {
//           maq_desconexion++;
//         }
//       });

//       respuesta[0][tablas[index]] = {
//         "num_maq_total": num_maq_total,
//         "maq_on": maq_on,
//         "body": Number((body / maq_on).toFixed(0)),
//         "eficiencia": (eficiencia / num_maq_total).toFixed(0),
//         "maq_desconexion": maq_desconexion
//       };
//     });

//     connection.end();

//     res.json(respuesta);
//   } catch (error) {
//     res.status(500).json({ error: 'Error en la consulta a la base de datos' });
//   }
// });

app.get('/general2', async (req, res) => {
  // try {
    const connection = mysql.createConnection(dbConfig);
    const connect = util.promisify(connection.connect).bind(connection);
    const query = util.promisify(connection.query).bind(connection);

    await connect();

    const resultsPromises = [
      query('SHOW COLUMNS FROM realtime_tricot_samples LIKE "power"'),
      query('SHOW COLUMNS FROM realtime_urdidos_samples LIKE "power"'),
      query('SHOW COLUMNS FROM realtime_raschel_samples LIKE "power"'),
      query('SHOW COLUMNS FROM realtime_circulares_samples LIKE "power"'),
      query('SHOW COLUMNS FROM realtime_tintoreria_samples LIKE "power"'),
      query('SHOW COLUMNS FROM realtime_ramas_samples LIKE "power"')
    ];
    
    const results = await Promise.all(resultsPromises);
    
    let respuesta = [{}];

    const tablas = [
      'TRICOT',
      'URDIDOS',
      'RASCHEL',
      'CIRCULARES',
      'TINTORERIA',
      'RAMAS'
    ];  
    
    results.forEach(async (result, index) => {
      const hasPowerColumn = result.length > 0;
      
      let eficiencia = 0;
      let num_maq_total = 0;
      let maq_on = 0;
      let body = 0;
      let maq_desconexion = 0;
    
      if (hasPowerColumn) {
        // Realizar la consulta con la condición de la columna 'power'
        const queryResult = await query(`SELECT COUNT(*) as count, SUM(CASE WHEN power = 2 THEN eficiencia ELSE 0 END) as eficiencia_on, SUM(CASE WHEN power = 2 THEN rpm ELSE 0 END) as body_on, SUM(CASE WHEN power = 0 THEN 1 ELSE 0 END) as maq_desconexion FROM realtime_${tablas[index].toLowerCase()}_samples`);

        
        // Extraer los valores de la consulta
        const { count, eficiencia_on, body_on, maq_desconexion: maq_desconexion_result } = queryResult[0];
      
        // Asignar los valores a las variables correspondientes
        num_maq_total = count;
        maq_on = eficiencia_on > 0 ? 1 : 0;
        body = body_on;
        maq_desconexion = maq_desconexion_result;
      
        // Realizar los cálculos necesarios
        eficiencia = eficiencia_on;
      }
      
      respuesta[0][tablas[index]] = {
        "num_maq_total": num_maq_total,
        "maq_on": maq_on,
        "body": Number((body / maq_on).toFixed(0)),
        "eficiencia": (eficiencia / num_maq_total).toFixed(0),
        "maq_desconexion": maq_desconexion
      };
    });
    
    res.json(respuesta);
    
  // } catch (error) {
  //   res.status(500).json({ error: 'Error en la consulta a la base de datos' });
  // }
});


app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor iniciado en el puerto 3000');
});
