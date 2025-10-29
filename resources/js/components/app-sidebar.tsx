import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { type NavItem, type Auth as AuthType } from '@/types';
import { Link } from '@inertiajs/react';
import { Wrench, FileSignature, Briefcase, BookOpenCheck, FileText, Building2, Users } from 'lucide-react';
import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Convenios',
        href: route('agreements.agreements.index'),
        icon: FileSignature,
        className: 'hover:bg-[#a1ccf4] hover:text-white active:bg-[#a1ccf4] active:text-[#1c65a9]',
    },
    {
        title: 'Pasantias',
        href: '#',
        //href: route('pasantias.pasantias.index'),
        icon: Briefcase,
        className: 'hover:bg-[#a1ccf4] hover:text-white active:bg-[#a1ccf4] active:text-[#1c65a9]',
    },
    {
        title: 'Becas de Formación',
        href: '#',
        //href: route('becasFormacion.becasFormacion.index'),
        icon: BookOpenCheck,
        className: 'hover:bg-[#a1ccf4] hover:text-white active:bg-[#a1ccf4] active:text-[#1c65a9]',
    },
    {
        title: 'Servicios Repetitivos',
        href: '#',
        //href: route('serviciosRepetitivos.serviciosRepetitivos.index'),
        icon: Wrench,
        className: 'hover:bg-[#a1ccf4] hover:text-white active:bg-[#a1ccf4] active:text-[#1c65a9]',
    },
    {
        title: 'Entidades',
        href: route('entities.dependencies.index'),
        icon: Building2,
        className: 'hover:bg-[#a1ccf4] hover:text-white active:bg-[#a1ccf4] active:text-[#1c65a9]',
    },
    {
        title: 'Documentos',
        href: route('documents.files.index'),
        icon: FileText,
        className: 'hover:bg-[#a1ccf4] hover:text-white active:bg-[#a1ccf4] active:text-[#1c65a9]',
    },
    {
        title: 'Usuarios',
        href: route('usuarios.index'),
        icon: Users,
        className: 'hover:bg-[#a1ccf4] hover:text-white active:bg-[#a1ccf4] active:text-[#1c65a9]',
    }
];

const footerNavItems: NavItem[] = [
    /*{
        title: 'Documentacion',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },*/
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="bg-[#4990e2] text-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-[#5fa9ee] hover:text-white">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator orientation="horizontal" className="bg-[#1c65a9] h-1" />
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
