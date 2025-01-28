
-- Create the "USUARIO" table
CREATE TABLE USUARIO (
    ID SERIAL PRIMARY KEY, -- Auto-incrementing integer ID
    nombre_usuario VARCHAR(255) NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    imagen_perfil VARCHAR(255) -- Path or URL to the profile image
);

-- Create the "CATEGORIA" table
CREATE TABLE CATEGORIA (
    ID SERIAL PRIMARY KEY, -- Auto-incrementing integer ID
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT -- Optional description
);

-- Create the "TAREA" table
CREATE TABLE TAREA (
    ID SERIAL PRIMARY KEY, -- Auto-incrementing integer ID
    texto_tarea TEXT NOT NULL,
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE, -- Defaults to today's date
    fecha_tentativa_finalizacion DATE, -- Tentative completion date
    estado VARCHAR(50) NOT NULL, -- Example: "Pending", "Completed", etc.
    ID_Usuario INT NOT NULL, -- Foreign key to USUARIO
    ID_Categoria INT, -- Foreign key to CATEGORIA
    CONSTRAINT fk_usuario FOREIGN KEY (ID_Usuario) REFERENCES USUARIO (ID) ON DELETE CASCADE,
    CONSTRAINT fk_categoria FOREIGN KEY (ID_Categoria) REFERENCES CATEGORIA (ID) ON DELETE SET NULL
);