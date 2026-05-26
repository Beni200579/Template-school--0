import type { ComponentType } from "react";
import { BadgeCheck, BriefcaseBusiness, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

const profile = {
  name: "Utilizador",
  role: "Perfil não configurado",
  email: "Não definido",
  phone: "Não definido",
  institution: "Não definida",
  accessLevel: "Não definido",
  status: "Dados por configurar",
};

export default function ProfileView() {
  return (
    <div id="profile-view" className="space-y-8">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-xs font-semibold uppercase text-slate-500">Perfil do utilizador</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">{profile.name}</h2>
        </div>

        <div className="grid gap-0 lg:grid-cols-[340px_1fr]">
          <aside className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-600 text-xl font-semibold text-white">
                UT
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{profile.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{profile.role}</p>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              {profile.status}
            </div>
          </aside>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <ProfileItem icon={Mail} label="E-mail" value={profile.email} />
            <ProfileItem icon={Phone} label="Telefone" value={profile.phone} />
            <ProfileItem icon={BriefcaseBusiness} label="Instituição" value={profile.institution} />
            <ProfileItem icon={ShieldCheck} label="Nível de acesso" value={profile.accessLevel} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 h-5 w-5 text-slate-500" />
          <div>
            <h3 className="text-base font-semibold text-slate-950">Dados administrativos</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Este perfil concentra os dados do responsável administrativo usado para autorizar operações da secretaria,
              validações financeiras e alterações de configuração do sistema.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
        <Icon className="h-4 w-4 text-emerald-700" />
        {label}
      </div>
      <p className="mt-3 text-sm font-medium text-slate-950">{value}</p>
    </div>
  );
}
