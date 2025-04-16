# Documento de Especificación de Requisitos de Software (SRS)

## 1. Introducción

### 1.1 Propósito del Documento
Este documento describe los requisitos del sistema para la aplicación de gestión de compras de videojuegos, incluyendo sus funcionalidades y características.

### 1.2 Alcance del Sistema
El sistema permite a los usuarios navegar, seleccionar y comprar videojuegos. Los usuarios pueden agregar productos a un carrito, realizar pagos y recibir confirmaciones de compra. Además, el sistema incluye páginas para mostrar productos, detalles de juegos y un sistema de autenticación.

### 1.3 Definiciones, Acrónimos y Abreviaturas
- **SRS**: Especificación de Requisitos de Software
- **ID**: Identificación
- **AJAX**: Asynchronous JavaScript and XML

## 2. Descripción General

### 2.1 Perspectiva del Producto
El sistema es una aplicación web que permite a los usuarios interactuar con una base de datos de videojuegos. Utiliza tecnologías como HTML, CSS, JavaScript y PHP.

### 2.2 Funcionalidades del Sistema
- **Página de Inicio (index.html)**: Muestra una introducción y enlaces a diferentes secciones del sitio.
- **Tienda (shop.html)**: Permite a los usuarios navegar por los videojuegos disponibles, filtrarlos por categoría y ver detalles de cada juego.
- **Carrito de Compras**: Los usuarios pueden agregar productos al carrito, actualizar cantidades y eliminar productos.
- **Proceso de Pago**: Los usuarios pueden seleccionar un método de pago y recibir una factura.
- **Sistema de Autenticación**: Permite a los usuarios registrarse y acceder a su cuenta.

### 2.3 Usuarios del Sistema
- **Clientes**: Usuarios que compran videojuegos.
- **Administradores**: Usuarios que gestionan el contenido del sistema.

## 3. Requisitos Funcionales

### 3.1 Página de Inicio
- Los usuarios pueden ver una introducción y enlaces a diferentes secciones del sitio.

### 3.2 Tienda
- Los usuarios pueden ver una lista de videojuegos disponibles.
- Los usuarios pueden filtrar productos por categoría.
- Los usuarios pueden ver detalles de cada juego.

### 3.3 Gestión del Carrito
- Los usuarios pueden agregar productos al carrito.
- Los usuarios pueden actualizar la cantidad de productos en el carrito.
- Los usuarios pueden eliminar productos del carrito.

### 3.4 Procesamiento de Pagos
- Los usuarios pueden seleccionar un método de pago.
- El sistema genera una factura con los detalles de la compra.

### 3.5 Sistema de Autenticación
- Los usuarios pueden registrarse y acceder a su cuenta.
- Las contraseñas deben ser almacenadas de forma segura.

## 4. Requisitos No Funcionales

### 4.1 Rendimiento
- El sistema debe cargar la página principal en menos de 3 segundos.

### 4.2 Seguridad
- Las contraseñas de los usuarios deben ser almacenadas de forma segura (hashing).

### 4.3 Usabilidad
- La interfaz debe ser intuitiva y fácil de usar para los usuarios.

## 5. Conclusiones
Este documento proporciona una visión general de los requisitos del sistema y servirá como base para el desarrollo y la implementación de la aplicación de gestión de compras de videojuegos.
