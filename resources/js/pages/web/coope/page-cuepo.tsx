import { Head } from "@inertiajs/react";
import Navbar from "@/components/website/navbar";
import Footer from "@/components/website/footer";
import Subtitle from "@/components/website/subtitle";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import PageLayout from "@/layouts/web/page-layout";

export default function Cuepo(){
    return (
        <PageLayout>
            <Subtitle title="C.U.E.P.O."/>

            <div>
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                CENTRO UNIVERSITARIO DE EDUCACIÓN PROFESIONAL Y OFICIOS
                            </h2>
                        </div>

                        <Card className="border-2 border-[#0d3b66] shadow-xl rounded-lg overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                                
                                {/* Sección de descripción principal */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-[#0d3b66]">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Fue creado según resolución <a href="https://bo.unsa.edu.ar/dr/R2023/R-DR-2023-0339.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0d3b66]">R-N° 0339-23</a> y se propone generar un espacio educativo destinado a fomentar la adquisición de competencias laborales que mejoren la empleabilidad en el sector de turismo y empresarial como así también generar herramientas para el autoempleo o emprendedurismo.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        Diseñamos una oferta de cursos en el ámbito de la formación profesional que les permita a las personas incorporarse en el mundo del trabajo, además de fortalecer el desarrollo personal mediante la elección de trayectos de formación y capacitación a lo largo de la vida.
                                    </p>
                                </div>

                                {/* Separador visual */}
                                <div className="flex items-center justify-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <div className="mx-4">
                                        <div className="w-3 h-3 bg-[#0d3b66] rounded-full"></div>
                                    </div>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Sección de Misión y Visión */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    
                                    {/* Misión */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-[#0d3b66] to-[#488edf] rounded-full flex items-center justify-center mr-4">
                                                <span className="text-white font-bold text-lg">M</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-[#0d3b66]">Misión</h3>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Generar nuevos espacios de formación profesional de calidad y oportunidades para la inclusión al empleo formal o el desarrollo de trayectorias de emprendimientos independientes.
                                        </p>
                                    </div>

                                    {/* Visión */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-[#488edf] to-[#0d3b66] rounded-full flex items-center justify-center mr-4">
                                                <span className="text-white font-bold text-lg">V</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-[#0d3b66]">Visión</h3>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Constituir un centro de referencia de la comunidad en materia de formación para el trabajo, consolidando redes de trabajo público-privado para fomentar la calidad de empleabilidad en la Provincia de Salta. Las demandas de habilidades y talentos que van surgiendo requieren de políticas de formación profesional que garanticen igualdad de condiciones y oportunidades para todas las personas.
                                        </p>
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

                                {/* Sección de redes sociales */}
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-[#0d3b66] mb-6">Síguenos en nuestras redes sociales</h3>
                                    <div className="flex justify-center space-x-6">
                                        
                                        {/* Instagram */}
                                        <a 
                                            href="https://www.instagram.com/cuepo.unsa/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="group flex flex-col items-center p-4 rounded-lg hover:bg-pink-50 transition-all duration-200 transform hover:scale-105"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow duration-200">
                                                <Instagram className="w-8 h-8 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">Instagram</span>
                                        </a>

                                        {/* Facebook */}
                                        <a 
                                            href="https://www.facebook.com/profile.php?id=61551023847015" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="group flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
                                        >
                                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow duration-200">
                                                <Facebook className="w-8 h-8 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Facebook</span>
                                        </a>

                                        {/* LinkedIn */}
                                        <a 
                                            href="https://www.linkedin.com/company/cuepo-unsa/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="group flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
                                        >
                                            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow duration-200">
                                                <Linkedin className="w-8 h-8 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">LinkedIn</span>
                                        </a>

                                    </div>
                                </div>
                                
                            </CardContent>
                        </Card>

                    </div>
                </section>
            </div>

            <div>
                <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                OFERTA DE CURSOS
                            </h2>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}