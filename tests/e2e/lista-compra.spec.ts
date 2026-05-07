import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    const databases = await indexedDB.databases?.();
    await Promise.all(
      (databases ?? [])
        .map((database) => database.name)
        .filter((name): name is string => Boolean(name))
        .map(
          (name) =>
            new Promise<void>((resolve, reject) => {
              const request = indexedDB.deleteDatabase(name);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
              request.onblocked = () => resolve();
            })
        )
    );
  });
  await page.reload();
});

test("flujo principal de compra", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Lista de la compra" })).toBeVisible();
  await expect(page.getByText("Tu lista está vacía")).toBeVisible();

  await page.getByRole("button", { name: "Catálogo", exact: true }).click();
  await page.getByRole("button", { name: "Añadir Agua" }).click();
  await page.getByRole("button", { name: "Cerrar catálogo" }).click();

  await expect(page.getByRole("heading", { name: "Bebidas" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Marcar comprado Agua" })).toBeVisible();

  await page.getByRole("button", { name: "Aumentar cantidad de Agua" }).click();
  await expect(page.getByText("2", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Reducir cantidad de Agua" }).click();
  await page.getByRole("button", { name: "Reducir cantidad de Agua" }).click();
  await expect(page.getByText("Agua eliminado")).toBeVisible();
  await page.getByRole("button", { name: "Deshacer" }).click();
  await expect(page.getByRole("button", { name: "Marcar comprado Agua" })).toBeVisible();
});

test("crear producto de catalogo con categoria", async ({ page }) => {
  await page.getByRole("button", { name: "Catálogo", exact: true }).click();
  await page.getByRole("textbox", { name: "Nombre del nuevo producto" }).fill("Galletas e2e");
  await page.getByLabel("Categoría").selectOption({ label: "Despensa" });
  await page.getByRole("button", { name: "Guardar y añadir" }).click();
  await page.getByRole("button", { name: "Cerrar catálogo" }).click();

  await expect(page.getByRole("heading", { name: "Despensa" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Marcar comprado Galletas e2e" })).toBeVisible();

  await page.getByRole("button", { name: "Catálogo", exact: true }).click();
  await page.getByRole("searchbox", { name: "Buscar producto" }).fill("galletas e2e");
  await expect(page.getByRole("button", { name: "Añadir Galletas e2e", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Añadir Galletas e2e a favoritos" }).click();
  await page.getByRole("searchbox", { name: "Buscar producto" }).fill("");
  await expect(page.getByRole("button", { name: "Quitar Galletas e2e de favoritos" })).toBeVisible();
  await page.getByRole("button", { name: "Eliminar Galletas e2e del catálogo" }).click();
  await expect(page.getByRole("dialog", { name: "Eliminar producto" })).toBeVisible();
  await page.getByRole("button", { name: "Sí, eliminar" }).click();
  await page.getByRole("searchbox", { name: "Buscar producto" }).fill("galletas e2e");
  await expect(page.getByRole("button", { name: "Añadir Galletas e2e", exact: true })).toHaveCount(0);
});

test("modo compra y modal de eliminacion", async ({ page }) => {
  await page.getByRole("button", { name: "Catálogo", exact: true }).click();
  await page.getByRole("button", { name: "Añadir Agua" }).click();
  await page.getByRole("button", { name: "Cerrar catálogo" }).click();

  await page.getByRole("button", { name: "Empezar compra" }).click();
  await expect(page.getByRole("button", { name: "Terminar compra" })).toBeVisible();
  await expect(page.getByText("Modo compra")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ajustes" })).toHaveCount(0);

  await page.getByRole("button", { name: "Marcar comprado Agua" }).click();
  await page.getByRole("button", { name: "Terminar compra" }).click();
  await page.getByRole("button", { name: "Eliminar productos comprados" }).click();

  await expect(page.getByRole("dialog", { name: "Eliminar comprados" })).toBeVisible();
  await page.getByRole("button", { name: "Cancelar" }).click();
  await expect(page.getByRole("button", { name: "Marcar pendiente Agua" })).toBeVisible();
});
