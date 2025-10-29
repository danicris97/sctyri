import { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type RoleOption = {
  value: string;
  label: string;
};

type UsuarioFormValues = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
};

export type UsuarioFormData = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export function useUsuarioForm(usuario?: UsuarioFormData) {
  return useForm<UsuarioFormValues>({
    name: usuario?.name ?? '',
    email: usuario?.email ?? '',
    password: '',
    password_confirmation: '',
    role: usuario?.role ?? '',
  });
}

type UsuarioFormProps = {
  usuario?: UsuarioFormData;
  roles: RoleOption[];
};

export default function UsuarioForm({ usuario, roles }: UsuarioFormProps) {
  const {
    data,
    setData,
    post,
    put,
    processing,
    errors,
    transform,
  } = useUsuarioForm(usuario);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    transform((formData) => ({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.trim(),
      password: formData.password.trim(),
      password_confirmation: formData.password_confirmation.trim(),
    }));

    const options = {
      preserveScroll: true,
      onError: () => {
        toast.error(
          usuario ? 'No pudimos actualizar el usuario.' : 'No pudimos crear el usuario.',
          { description: 'Revisa los datos ingresados.' },
        );
      },
    };

    if (usuario) {
      put(route('usuarios.update', usuario.id), options);
      return;
    }

    post(route('usuarios.store'), options);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo *</Label>
          <Input
            id="name"
            name="name"
            value={data.name}
            onChange={(event) => setData('name', event.target.value)}
            placeholder="Ej. Ana Perez"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electronico *</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            onChange={(event) => setData('email', event.target.value)}
            placeholder="usuario@unsa.edu.ar"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rol *</Label>
        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
          <SelectTrigger id="role" aria-invalid={Boolean(errors.role)}>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Contrasena {usuario ? '(opcional)' : '*'}</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={data.password}
            onChange={(event) => setData('password', event.target.value)}
            placeholder={usuario ? 'Deja en blanco para mantener la actual' : 'Minimo 8 caracteres'}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirmar contrasena {usuario ? '(opcional)' : '*'}</Label>
          <Input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            onChange={(event) => setData('password_confirmation', event.target.value)}
            placeholder="Repite la contrasena"
            className={errors.password_confirmation ? 'border-red-500' : ''}
          />
          {errors.password_confirmation && (
            <p className="text-sm text-red-500">{errors.password_confirmation}</p>
          )}
        </div>
      </div>

      {usuario && (
        <p className="text-sm text-muted-foreground">
          Si no deseas cambiar la contrasena deja los campos vacios.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#0e3b65] text-white hover:bg-[#1e5b95]"
          disabled={processing}
        >
          {processing
            ? 'Guardando...'
            : usuario
              ? 'Actualizar usuario'
              : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
}
