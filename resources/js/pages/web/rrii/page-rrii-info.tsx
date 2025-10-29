import Subtitle from "@/components/website/subtitle";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/layouts/web/page-layout";

export default function RriiInfo(){
    return (
        <PageLayout>
            <Subtitle title="INFORMACIÓN GENERAL" />
            <div>
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                INFORMACIÓN GENERAL RELACIONES INTERNACIONALES
                            </h2>
                        </div>

                        <Card className="border-2 border-[#0d3b66] shadow-xl rounded-lg overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                                
                                {/* Sección de información institucional */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-[#0d3b66]">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-semibold text-[#0d3b66]">Institución:</span>
                                                <p className="text-gray-700">UNIVERSIDAD NACIONAL DE SALTA (UNSa)</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#0d3b66]">Oficina de Relaciones Internacionales:</span>
                                                <p className="text-gray-700">Secretaria de Cooperación Técnica y Relaciones Internacionales</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#0d3b66]">Dirección Postal:</span>
                                                <p className="text-gray-700">Avda. Bolivia nº 5150 – Salta, Argentina (CP 4400)</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#0d3b66]">Teléfonos:</span>
                                                <p className="text-gray-700">(0387) – 4255555 / 4255533</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-semibold text-[#0d3b66]">Email:</span>
                                                <p className="text-gray-700">coreinte@unsa.edu.ar</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#0d3b66]">Horario de la oficina:</span>
                                                <p className="text-gray-700">9 a 13 hs</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#0d3b66]">Director/Jefe de la oficina:</span>
                                                <p className="text-gray-700">Dr. Nilsa María Sarmiento Barbieri</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#0d3b66]">Responsable de Movilidad:</span>
                                                <p className="text-gray-700">Lic. Ximena Segón</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Separador visual */}
                                <div className="flex items-center justify-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <div className="mx-4">
                                        <div className="w-3 h-3 bg-[#0d3b66] rounded-full"></div>
                                    </div>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Sección de procedimiento de inscripción */}
                                <div>
                                    <h3 className="text-2xl font-bold text-[#0d3b66] mb-6">
                                        Procedimiento de inscripción de los estudiantes
                                    </h3>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <p className="text-gray-700 mb-4">
                                            Prescripción on-line, necesidad de envío de los documentos originales, etc. Envío vía E-mail y correo postal (antes del arribo del alumno) de la siguiente documentación:
                                        </p>
                                        
                                        <ul className="space-y-2">
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-[#0d3b66] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Carta de presentación por parte de la Universidad Origen
                                            </li>
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-[#0d3b66] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Solicitud de Admisión (se debe adjuntar estado curricular / Kardex / Historial académico)
                                            </li>
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-[#0d3b66] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Copia de Pasaporte
                                            </li>
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-[#0d3b66] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                Copia del Seguro de Vida del Alumno
                                            </li>
                                        </ul>

                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                            <p className="text-gray-700">
                                                <span className="font-semibold text-[#0d3b66]">Número de vacantes:</span> 4 por semestre académico por universidad
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Separador visual */}
                                <div className="flex items-center justify-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <div className="mx-4">
                                        <div className="w-3 h-3 bg-[#488edf] rounded-full"></div>
                                    </div>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Sección de fechas límite y períodos */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <h4 className="text-lg font-semibold text-[#0d3b66] mb-4 pb-2 border-b border-gray-200">
                                            Fecha límite de postulaciones
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-semibold text-gray-800">1º Período (Marzo-Julio):</span>
                                                <p className="text-gray-700">Del 1 de Septiembre al 15 de Diciembre</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-800">2º Período (Agosto-Diciembre):</span>
                                                <p className="text-gray-700">Del 1 de Marzo al 30 de Mayo</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <h4 className="text-lg font-semibold text-[#0d3b66] mb-4 pb-2 border-b border-gray-200">
                                            Duración de los semestres académicos
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-semibold text-gray-800">1º Período:</span>
                                                <p className="text-gray-700">Marzo – Julio</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-800">2º Período:</span>
                                                <p className="text-gray-700">Agosto – Diciembre</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Separador visual */}
                                <div className="flex items-center justify-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <div className="mx-4">
                                        <div className="w-3 h-3 bg-[#0d3b66] rounded-full"></div>
                                    </div>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Sección de gastos y servicios */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                        <h4 className="text-lg font-semibold text-[#0d3b66] mb-4">
                                            Gastos que deban abonar los estudiantes
                                        </h4>
                                        <div className="bg-white p-4 rounded border-l-4 border-red-400">
                                            <span className="font-semibold text-gray-800">Tasa de Radicación:</span>
                                            <p className="text-gray-700 text-sm mt-1">
                                                Dirección Nacional de Migraciones (Es conveniente que el alumno se informe sobre los trámites para Radicación como Estudiante, en el Consulado Argentino de su país de origen).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h4 className="text-lg font-semibold text-[#0d3b66] mb-4">
                                            Servicios que ofrece la Universidad
                                        </h4>
                                        <ul className="space-y-3">
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <div>
                                                    <span className="font-medium">Educación Gratuita</span> – Sin arancel
                                                </div>
                                            </li>
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <div>
                                                    <span className="font-medium">Beca de Comedor</span> (Almuerzo de Lunes a Viernes)
                                                    <a 
                                                        href="http://becas.unsa.edu.ar/index.php/tbecas" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-xs ml-2"
                                                    >
                                                        Ver más →
                                                    </a>
                                                </div>
                                            </li>
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <div>
                                                    <span className="font-medium">Transporte Urbano Gratuito</span> (Lunes a Viernes)
                                                    <a 
                                                        href="https://www.saetasalta.com.ar/beneficio_estudiantil.asp" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-xs ml-2"
                                                    >
                                                        Ver más →
                                                    </a>
                                                </div>
                                            </li>
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <div>
                                                    <span className="font-medium">Beca de Deporte</span> (Tarifa reducida de Lunes a Viernes)
                                                    <a 
                                                        href="https://www.facebook.com/deporte.universitariounsa/?locale=es_LA" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-xs ml-2"
                                                    >
                                                        Ver más →
                                                    </a>
                                                </div>
                                            </li>
                                            <li className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className="font-medium">Acceso a Material Bibliográfico e Internet</span> en el Campus Universitario
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                
                            </CardContent>
                        </Card>
            
                    </div>
                </section>
            </div>

            {/* Sección de oferta académica */}
            <div>
                <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                OFERTA ACADEMICA
                            </h2>
                        </div>

                        <Card className="border-2 border-[#0d3b66] shadow-xl rounded-lg overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                            <div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-[#0d3b66]">Ciencias Económicas</span>
                                                    <a 
                                                        href="https://economicas.unsa.edu.ar/web/index.php" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-sm font-medium"
                                                    >
                                                        Ver sitio →
                                                    </a>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1">Contacto: sececo@unsa.edu.ar</p>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-[#0d3b66]">Ciencias Exactas</span>
                                                    <a 
                                                        href="https://exactas.unsa.edu.ar/" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-sm font-medium"
                                                    >
                                                        Ver sitio →
                                                    </a>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1">Contacto: secexa@unsa.edu.ar</p>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-[#0d3b66]">Humanidades</span>
                                                    <a 
                                                        href="http://hum.unsa.edu.ar/" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-sm font-medium"
                                                    >
                                                        Ver sitio →
                                                    </a>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1">Contacto: sechum@unsa.edu.ar</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-[#0d3b66]">Ingeniería</span>
                                                    <a 
                                                        href="http://www.ing.unsa.edu.ar/" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-sm font-medium"
                                                    >
                                                        Ver sitio →
                                                    </a>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1">Contacto: secing@unsa.edu.ar</p>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-[#0d3b66]">Naturales</span>
                                                    <a 
                                                        href="http://natura.unsa.edu.ar/web/index.php" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-sm font-medium"
                                                    >
                                                        Ver sitio →
                                                    </a>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1">Contacto: secnat@unsa.edu.ar</p>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-[#0d3b66]">Ciencias de la Salud</span>
                                                    <a 
                                                        href="http://fsalud.unsa.edu.ar/salud/" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#488edf] hover:text-[#0d3b66] text-sm font-medium"
                                                    >
                                                        Ver sitio →
                                                    </a>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1">Contacto: secsal@unsa.edu.ar</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}