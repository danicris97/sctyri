import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface RepetetiveServicesLayoutProps extends PropsWithChildren {
    title: string;
    description: string;
}

const sidebarNavItems: NavItem[] = [
    {
        title: 'Servicios Tecnicos Repetitivos',
        href: '#',
        icon: null,
    },
    {
        title: 'Comitentes',
        href: '#',
        icon: null,
    },
    {
        title: 'Unidades Ejecutoras',
        href: '#',
        icon: null,
    },
    {
        title: 'Personas Responsables',
        href: '#',
        icon: null,
    },
];

export default function RepetetiveServicesLayout({ children, title, description }: RepetetiveServicesLayoutProps) {
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title={title} description={description} />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full lg:w-48 max-w-xl shrink-0">
                    <nav className="flex flex-col space-y-1">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <div className="hidden lg:block w-[2px] h-auto bg-gradient-to-b from-[#0e3b65] to-[#4990e2]" />

                <div className="w-full flex-1 min-w-0">
                    <section>{children}</section>
                </div>
            </div>
        </div>
    );
}