import { ClipboardList, FileCheck2, ReceiptText, Route, Shirt, Utensils } from "lucide-react";

const services = [
  { title: "Declarações", description: "Emissão de declarações de matrícula, frequência e aproveitamento.", icon: FileCheck2 },
  { title: "Uniformes", description: "Registo de pedidos, tamanhos e entrega de fardamento escolar.", icon: Shirt },
  { title: "Transporte", description: "Gestão de rotas, paragens e mensalidades de transporte.", icon: Route },
  { title: "Cantina", description: "Inscrição em planos de alimentação e controlo de pagamentos.", icon: Utensils },
  { title: "Emolumentos", description: "Taxas administrativas, segunda via e outros serviços cobrados.", icon: ReceiptText },
  { title: "Requerimentos", description: "Entrada e acompanhamento de pedidos administrativos.", icon: ClipboardList },
];

export default function ServicosView() {
  return (
    <div id="services-view" className="space-y-7">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase text-emerald-700">Secretaria / Serviços</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Serviços escolares</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Centralize pedidos administrativos, cobranças avulsas e serviços complementares da escola.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <article key={service.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
