export default function AppLogo() {
    return (
        <>
            <div 
                className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
                style={{ backgroundColor: '#0e3b65' }}  // Fondo sólido azul oscuro
            >
                <img
                    src="/images/logo-unsa-blanco.png"
                    alt="Logo de SCTyRI UNSa"
                    className="object-contain h-full w-full p-1"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">SCTyRI</span>
                <span className="mb-0.5 truncate leading-tight text-xs text-white">  {/* Texto en blanco */}
                    Universidad Nacional de Salta
                </span>
            </div>
        </>
    );
}