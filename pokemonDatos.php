<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="icon" href="./img/Psydex.png" type="image/png">
    <link rel="stylesheet" href="./css/css.css">
    <script src="./js/pokeDatosAside.js" defer></script>
    <script src="./js/pokeDatosSection.js" defer></script>
    <title>Pokemon Datos</title>
    <style>
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

        section {
            border-radius: 5px;
        }

        #pokemon-movimientos {
            font-size: 0.9em;
        }

        @media (max-width: 767px) {
            section {
                margin-top: 10px;
            }

                .flex-md-row {
                flex-direction: column !important;
            }

            #pokemon-evolucion img {
                width: 120px;
            }

            .method-responsive {
                margin: 2rem !important;
            }
        }
    </style>
</head>

<body class="bg-dark text-white">

    <?php include("./php/cabezera.php"); ?>

    <main class="container d-flex flex-column flex-md-row justify-content-center align-items-start mt-5 col-md-10">
        <!-- Section para el contenido principal -->
        <section id="pokemon-main-container" class="col-12 col-md-7 p-3 bg-white mr-md-5 p-3 d-flex flex-column text-dark order-2 order-md-1">
            <div id="pokemon-stats" class="">
                <h4>Base Stats:</h4>
                <!-- Aquí mostramos las estadísticas bases del pokémon -->
            </div>
            <div id="pokemon-evolucion" class="mt-3">
                <h4>Evolution:</h4>
                <!-- Aquí mostramos la línea evolutiva del pokémon -->
            </div>
            <div id="pokemon-movimientos" class="accordion mt-5">
                <!-- Aquí mostramos los movimientos del pokémon -->
            </div>
        </section>

        <!-- Aside para mostrar los datos del Pokémon -->
        <aside class="col-12 col-md-5 bg-white p-3 d-flex flex-column flex-md-row text-dark order-1 order-md-2">
            <!-- Contenedor principal con información del Pokémon -->
            <div id="pokemon-aside" class="col-12 col-md-6 text-center">
                <!-- Aquí se insertarán los datos desde JavaScript -->
            </div>

            <!-- Contenedor de las formas alternas -->
            <div id="pokemon-forms" class="col-12 col-md-6 text-center mt-3 mt-md-0">
                <!-- Las formas se agregarán aquí dinámicamente -->
            </div>
        </aside>

    </main>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.4.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>

</html>
