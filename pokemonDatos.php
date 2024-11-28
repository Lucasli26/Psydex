<?php

?>
<?php
// Aquí va tu código PHP si es necesario
?>
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

        aside{
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
    </style>
</head>

<body class="bg-dark text-white">

    <?php include("./php/cabezera.php"); ?>

    <div class="d-flex">
        <main class="container-fluid d-flex justify-content-center p-0">
            <!-- Section para el contenido principal -->
            <section class="col-md-8 col-12 p-3">
                <div id="pokemon-info">
                    <!-- <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae atque ullam iste excepturi itaque accusantium dolore, possimus ipsum quaerat expedita nam perspiciatis ab cumque non repudiandae animi? Molestiae, est ullam.</p> -->

                    <!-- Aquí agregamos la línea evolutiva -->
                    <div id="evolution-chain" class="evolution-chain">
                        <!-- Aquí se insertarán las imágenes de la evolución desde JavaScript -->
                    </div>
                </div>
            </section>
        </main>

        <!-- Aside para mostrar el ícono del Pokémon, tipos y habilidades -->
        <aside class="col-md-4 col-12 bg-danger mt-5 p-3 d-flex flex-column align-items-center text-dark">
            <div id="pokemon-aside" class="text-center">
                <!-- Aquí se insertarán los datos desde JavaScript -->
            </div>
        </aside>
    </div>

</body>

</html>
