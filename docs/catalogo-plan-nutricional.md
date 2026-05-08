# Productos a incorporar desde el plan nutricional

Origen revisado:

- `C:\Personal\Workspace\plan-nutricional\lib\plan.ts`
- `C:\Personal\Workspace\plan-nutricional\lib\recetas.ts`

Comparado contra el catálogo actual de `lista-compra` en `src/db/seed.ts`.

## Resumen

El catálogo actual cubre los básicos principales, pero el plan nutricional introduce muchos productos frecuentes de dieta semanal: legumbres, verduras concretas, pescado blanco, frutos secos, especias, infusiones y variantes saludables de pan, leche y yogur.

La recomendación es añadir estos productos al catálogo para que las personas usuarias puedan construir listas de compra más completas sin escribir manualmente tantos alimentos.

## Frutas y verduras

| Producto | Motivo |
| --- | --- |
| Aguacate | Aparece en tostada de desayuno. |
| Ajo | Base recurrente en recetas de legumbres, verduras y pescado. |
| Apio | Aparece como opcional en sopas/cocido. |
| Brócoli | Guarnición del pollo al horno. |
| Calabacín | Cremas y guarniciones. |
| Espárragos verdes | Guarnición de merluza. |
| Espinacas | Garbanzos con espinacas. |
| Frambuesas | Desayuno con yogur. |
| Fresas | Alternativa a frambuesas. |
| Fruta de temporada | Producto genérico útil para meriendas. |
| Judías verdes | Guarnición de sardinas. |
| Kiwi | Desayuno opcional. |
| Limones | Aderezo de pollo, pescado y salmón. |
| Mandarinas | Media mañana. |
| Naranjas | Media mañana. |
| Pera | Merienda. |
| Pimiento verde | Tortilla de verduras. |
| Pimientos | Producto más general para tortilla/verduras. |
| Puerro | Lentejas, sopas y cocido ligero. |
| Tomates cherry | Tostada con aguacate. |
| Zanahorias | Lentejas, judías, sopas y cocido. |

## Carne y pescado

| Producto | Motivo |
| --- | --- |
| Bacalao | Alternativa de pescado blanco. |
| Dorada | Alternativa de pescado blanco. |
| Lubina | Alternativa de pescado blanco. |
| Marisco | Opción de comida familiar tipo paella. |
| Merluza | Cena de pescado al horno. |
| Pechuga de pollo | Variante concreta más saludable que "Pollo". |
| Pescado blanco | Producto genérico útil para la cena semanal. |
| Sardinas | Cena de sardinas a la plancha. |

## Lácteos

| Producto | Motivo |
| --- | --- |
| Leche semidesnatada | Porridge y café con leche. |
| Leche vegetal | Batido/merienda con plátano. |
| Yogur griego 0% | Meriendas y postres ligeros. |
| Yogur griego light | Desayuno con fruta. |
| Yogur natural 0% | Desayunos y meriendas. |

## Panadería

| Producto | Motivo |
| --- | --- |
| Pan integral | Aparece varias veces como acompañamiento y tostada. |
| Tostadas integrales | Desayunos y cenas rápidas. |

## Despensa

| Producto | Motivo |
| --- | --- |
| Almendras | Desayunos y snacks. |
| Avena | Desayunos tipo porridge. |
| Cacao puro | Postre con yogur. |
| Caldo de verduras | Sopas, cremas y media mañana. |
| Caldo desgrasado | Comida de domingo/cocido ligero. |
| Canela | Desayunos, infusiones y postres. |
| Chocolate negro 85% | Snack puntual. |
| Dátiles | Merienda con nuez. |
| Eneldo | Salmón a la plancha. |
| Fideos finos | Sopa de fideos. |
| Garbanzos | Varias comidas semanales. |
| Judías blancas | Guiso de viernes. |
| Laurel | Lentejas y judías. |
| Lentejas pardinas | Plato de lunes. |
| Miel | Porridge y yogur. |
| Nueces | Snacks y yogur. |
| Olivas | Ensalada con atún. |
| Perejil | Pescado blanco. |
| Pimentón dulce | Legumbres. |
| Pimienta | Condimento recurrente. |
| Sal | Básico recurrente de recetas. |
| Stevia | Postres y manzana asada. |
| Tomillo | Pollo al horno. |
| Vinagre | Cocción del huevo pochado. |

## Bebidas

| Producto | Motivo |
| --- | --- |
| Infusiones | Producto genérico para cubrir varias tomas semanales. |
| Infusión de canela | Merienda concreta. |
| Infusión de jengibre | Media mañana. |
| Infusión de manzanilla | Merienda. |
| Infusión de menta | Media mañana. |
| Infusión de rooibos | Media mañana. |

## Productos ya cubiertos por el catálogo actual

No los incluyo como nuevos porque ya existen en el catálogo base o están razonablemente cubiertos por un producto equivalente:

- `Aceite de oliva`
- `Agua`
- `Arroz`
- `Atún`
- `Café`
- `Cebollas`
- `Harina`
- `Huevos`
- `Leche`
- `Lechuga`
- `Manzanas`
- `Pan`
- `Pasta`
- `Patatas`
- `Plátanos`
- `Pollo`
- `Queso`
- `Salmón`
- `Tomates`
- `Yogur`

## Recomendación de implementación

Para incorporarlos al catálogo de la aplicación, conviene hacerlo con cuidado:

1. Añadir los productos al seed inicial por categoría.
2. Cambiar la lógica de seed para que inserte los nuevos productos sin borrar productos personalizados ya creados por usuarios.
3. Evitar duplicados por nombre normalizado y categoría.
4. Mantener algunos productos como genéricos para no saturar la UI, por ejemplo `Infusiones`, `Pescado blanco` o `Fruta de temporada`.

No recomiendo simplemente subir la versión del seed y limpiar el catálogo local, porque eso podría eliminar productos personalizados añadidos desde la app.
