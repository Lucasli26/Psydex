<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="icon" href="./img/Psydex.png" type="image/png">
    <link rel="stylesheet" href="./css/css.css">
    <script src="pokeDatos.js" defer></script>
    <title>Pokemon Datos</title>
    <style>
        /* Personalizaciones adicionales si es necesario */
        * {
            text-align: center;
        }

        main {
            height: 100%;
            margin: 0;
            padding: 0;
        }

        aside {
            border-radius: 5px;
        }

        #fotoLogo {
            min-width: 75px;
        }

        a {
            font-size: 25px;
        }

        .pokemon-type img {
            width: 70px;
            height: 30px;
        }

        .evolution-chain img {
            width: 100px;
            margin: 5px;
        }

        .evolution-chain {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }

        .evolution-chain p {
            text-align: center;
            margin-top: 10px;
        }
        table{
            font-size: 0.75rem;
        }
    </style>
</head>

<body class="bg-dark text-white">

    <?php include("./php/cabezera.php"); ?>

    <main class="container-fluid d-flex justify-content-center p-0">
        <!-- Section para el contenido principal -->
        <section class="col-md-8 col-12 p-3">
            <div id="pokemon-info">
                <!-- Aquí agregamos la línea evolutiva -->
                <div id="evolution-chain" class="evolution-chain">
                    <!-- Aquí se insertarán las imágenes de la evolución desde JavaScript -->
                </div>
            </div>
        </section>
        <!-- Aside para mostrar el ícono del Pokémon, tipos y habilidades -->
        <aside class="col-md-4 col-12 bg-danger mt-5 mr-5 p-3 d-flex flex-column align-items-center text-dark">
            <div id="pokemon-aside" class="text-center">
                <!-- Aquí se insertarán los datos desde JavaScript -->
            </div>

            <!-- Tabla para mostrar los objetos sostenidos por generaciones -->
            <div id="objetos-sostenidos" class="mt-4">
                <p>Held items:</p>
                <table id="tabla-objetos" class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Objeto</th>
                            <th>I</th>
                            <th>II</th>
                            <th>III</th>
                            <th>IV</th>
                            <th>V</th>
                            <th>VI</th>
                            <th>VII</th>
                            <th>VIII</th>
                            <th>IX</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Las filas de la tabla se llenarán dinámicamente -->
                    </tbody>
                </table>
            </div>
        </aside>
    </main>

</body>

</html>
