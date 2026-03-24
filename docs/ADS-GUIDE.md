# Guia de lanzamiento de publicidad — Pentacode

Presupuesto objetivo: hasta USD 100/mes.
Prioridad: Google Search (~80-90%) + Meta/Instagram remarketing (~10-20%).

---

## Paso 0 — Prerequisitos

1. **Dominio publicado con SSL** (ver `deploy.sh`).
2. **GTM configurado**: crear contenedor en https://tagmanager.google.com e ingresar el ID en `NEXT_PUBLIC_GTM_ID` del `.env`.
3. **GA4 vinculado a GTM**: crear propiedad en https://analytics.google.com y agregar la etiqueta GA4 Configuration dentro de GTM.

### Configurar conversiones en GTM

| Tag en GTM              | Trigger                                | Tipo              |
|-------------------------|----------------------------------------|-------------------|
| GA4 Event — quote_submit | Custom Event: `quote_submit`          | GA4 Event         |
| GA4 Event — contact_whatsapp | Custom Event: `contact_whatsapp` | GA4 Event         |
| GA4 Event — contact_email | Custom Event: `contact_email`        | GA4 Event         |
| GA4 Event — chat_open   | Custom Event: `chat_open`             | GA4 Event         |
| Google Ads Conversion   | Custom Event: `quote_submit`          | Google Ads Conversion Tracking |
| Meta Pixel — Lead       | Custom Event: `quote_submit`          | Meta Pixel Custom Event |

**Publicar el contenedor de GTM** despues de configurar los tags.

### Marcar conversiones

- En **GA4** > Admin > Events: marcar `quote_submit` como conversion.
- En **Google Ads** > Tools > Conversions: importar desde GA4 o crear conversion manual con el tag de GTM.
- En **Meta Events Manager**: verificar que `Lead` (quote_submit) se recibe.

---

## Paso 1 — Google Ads Search (principal)

### Crear cuenta

1. Ir a https://ads.google.com y crear cuenta con la misma cuenta de Google de GA4.
2. Vincular GA4 desde Tools > Linked accounts.

### Estructura de campana

```
Campana: Pentacode — Desarrollo Web Argentina
  Presupuesto: USD 2.50-3.00/dia (~USD 80/mes)
  Objetivo: Conversiones (quote_submit)
  Red: Solo Search (NO Display ni Partners al inicio)

  Grupo 1: Desarrollo Web
    Keywords:
      "desarrollo web argentina"
      "crear pagina web"
      "diseño web profesional"
      "empresa desarrollo web"
      "hacer pagina web precio"
    Match type: Phrase match para todas

  Grupo 2: Sistemas y Apps
    Keywords:
      "sistema de gestion a medida"
      "desarrollo de aplicaciones"
      "software a medida argentina"
    Match type: Phrase match

  Grupo 3: Tienda Online
    Keywords:
      "crear tienda online"
      "ecommerce argentina"
      "tienda online precio"
    Match type: Phrase match
```

### Anuncios (RSA — Responsive Search Ads)

Titulares (max 30 chars cada uno, 15 variantes):
1. Desarrollo Web Profesional
2. Tu Idea, Nuestra Especialidad
3. MVP en 7 Dias
4. Entregas Semanales
5. Presupuesto Sin Cargo
6. +50 Proyectos Entregados
7. 99% Satisfaccion
8. React & Next.js Experts
9. Consultanos por WhatsApp
10. Equipo Argentino
11. Pagina Web a Medida
12. Tienda Online Completa
13. Sistema de Gestion
14. Diseño Web Moderno
15. Contanos Tu Proyecto

Descripciones (max 90 chars, 4 variantes):
1. Transformamos tu idea en una web de alto impacto. Metodologia agil con entregas semanales.
2. Mas de 50 proyectos entregados. MVP funcional en 1 semana. Pedinos presupuesto gratis.
3. Desarrollo web, tiendas online y sistemas a medida. Equipo profesional argentino.
4. Contactanos hoy y recibí un presupuesto personalizado para tu proyecto digital.

### Negativas iniciales

```
gratis
curso
tutorial
como hacer
empleo
trabajo
freelancer
wordpress
wix
```

### Landing pages

- ES: `https://tu-dominio.com/es#contacto`
- EN: `https://tu-dominio.com/en#contacto` (si hay publico en ingles)

---

## Paso 2 — Meta / Instagram (secundario)

### Crear cuenta

1. Ir a https://business.facebook.com
2. Crear Business Manager + Ad Account + Meta Pixel.
3. Instalar Pixel via GTM (usar tag de Meta Pixel con el Pixel ID).

### Audiencias

| Audiencia            | Definicion                                    |
|----------------------|-----------------------------------------------|
| Web Visitors 30d     | Pixel: todos los visitantes ultimos 30 dias   |
| Engaged Visitors     | Pixel: evento `chat_open` o `contact_whatsapp` |
| Lookalike 1%         | Basada en Web Visitors 30d (crear cuando haya +100 visitors) |

### Campana de remarketing

```
Campana: Pentacode — Remarketing
  Presupuesto: USD 0.50-0.70/dia (~USD 20/mes)
  Objetivo: Conversiones (Lead)
  Ubicaciones: Instagram Feed + Stories + Reels + Facebook Feed

  Conjunto: Remarketing sitio
    Audiencia: Web Visitors 30d — excluir ya convertidos
    Creativos:
      - Imagen: screenshot del portfolio + texto "Tu idea merece una web profesional"
      - Carrusel: 3 proyectos completados con breve descripcion
      - Video corto (15s): pantalla grabada navegando la web + CTA
    CTA: "Pedir presupuesto" → link a https://tu-dominio.com/es#contacto
```

---

## Paso 3 — Optimizacion semanal (primer mes)

### Semana 1
- Revisar Search Terms report en Google Ads.
- Agregar negativas agresivamente.
- Verificar que las conversiones se registran en GA4 y Google Ads.

### Semana 2
- Pausar keywords con CTR < 1% y sin conversiones.
- Ajustar pujas: subir en keywords con conversiones, bajar en las que gastan sin convertir.
- En Meta: revisar frecuencia (si > 3, ampliar audiencia o pausar).

### Semana 3
- Evaluar CPL (costo por lead).
  - Objetivo razonable con este presupuesto: USD 10-25 por lead.
  - Si CPL > USD 30: revisar landing, keywords y anuncios.
- Probar un nuevo anuncio en Google (variante de titulares).

### Semana 4
- Reporte mensual: leads totales, CPL, fuente (Google vs Meta vs organico).
- Decidir: mantener distribucion o mover mas presupuesto a lo que mejor convierte.
- Si hay +100 visitors: crear Lookalike en Meta.

---

## Metricas clave a monitorear

| Metrica              | Donde verla                  | Objetivo inicial  |
|----------------------|------------------------------|--------------------|
| Leads (quote_submit) | GA4 > Events > Conversions   | 4-10/mes           |
| CPL                  | Google Ads > Campaigns       | < USD 25           |
| CTR                  | Google Ads > Ad Groups       | > 3%               |
| Clics WhatsApp       | GA4 > Events                 | Tracking           |
| Bounce Rate          | GA4 > Pages                  | < 60%              |
| ROAS                 | Manual (ingresos/gasto ads)  | Evaluar mes 2-3    |
