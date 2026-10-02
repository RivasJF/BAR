import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

interface RouterLayout {
  name: string;
  route: string;
  icon: string;
  label: string;
  color: string;
}

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: "main-layout",
  templateUrl: "./main-layout.component.html",
})
export class MainLayout {
  routes: RouterLayout[] = [
    {
      name: "Panel",
      route: "/books/panel",
      icon: "home",
      label: "Panel",
      color: "text-white",
    },
    {
      name: "Register",
      route: "/books/register",
      icon: "add_notes",
      label: "Register",
      color: "text-emerald-300",
    },
    {
      name: "Export-Import",
      route: "/books/panel",
      icon: "file_export",
      label: "Export-Import",
      color: "text-purple-800",
    },
  ];
}
