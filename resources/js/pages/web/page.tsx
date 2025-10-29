import { type SharedData } from '@/types';
import PageLayout from '@/layouts/web/page-layout';
import { usePage } from '@inertiajs/react';
import { Globe, Users, Handshake, FilePen, MapPin, Mail, Phone, Quote, CircleUserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import WhatsApp from '@/components/icons/whatsapp';

export default function Welcome() {
    const Autoridades = [
        {
          nombre: "Dr. Nilsa María SARMIENTO BARBIERI",
          cargo: "Secretaria de Cooperación Técnica y Relaciones Internacionales",
          img: "/images/nilsa.png",
        },
        {
          nombre: "Lic. Ximena SEGÓN",
          cargo: "Jefa de Sección Relaciones Internacionales",
          img: "",
        },
        {
          nombre: "Sra. Patricia ARIAS",
          cargo: "Jefa de Departamento de Promoción y Servicio",
          img: "",
        },
    ]

    const { auth } = usePage<SharedData>().props;
    const { convenios, convenios_internacionales, pasantias, pps } = usePage<SharedData>().props;

    const estadisticas = [
        { numero: convenios, descripcion: "Convenios", icono: FilePen },
        { numero: pasantias, descripcion: "Pasantías", icono: Handshake },
        { numero: pps, descripcion: "Prácticas Profesionales", icono: Users },
        { numero: convenios_internacionales, descripcion: "Convenios Internacionales", icono: Globe },
    ]

    return (
        <PageLayout>
            {/* Imagen de fondo */}
            <div className="w-full overflow-hidden relative">
                <img
                    src="/images/foto-rectorado-fondo.jpg"
                    alt="Foto del Rectorado"
                    className="w-full h-full object-cover brightness-60"
                    style={{
                        objectPosition: "center 30%",
                        height: "100vh",
                    }}
                />

                {/* Contenedor centrado para logo y texto */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <img
                        src="/images/logo-unsa-blanco.png"
                        alt="Logo UNSa"
                        className="w-12 sm:w-16 md:w-20 lg:w-24 mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6"
                    />
                    <div>
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                            Secretaría de Cooperación Técnica y Relaciones Internacionales
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white mt-1 sm:mt-2">
                            Universidad Nacional de Salta
                        </p>
                    </div>
                </div>
            </div>

            {/*Seccion de estadisticas*/}
            <div id="estadisticas">
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {estadisticas.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#488edf] to-[#0d3b66] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                                <stat.icono className="h-8 w-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent">
                                {stat.numero}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.descripcion}</div>
                            </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            
            {/*Seccion autoridades */}
            <div id="autoridades">
                <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                            AUTORIDADES
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {Autoridades.map((autoridad, index) => (
                                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <CardContent className="p-8 flex flex-col items-center text-center">
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-[#488edf] to-[#0d3b66] rounded-full flex items-center justify-center text-white font-semibold mb-4 overflow-hidden shadow-lg">
                                            {autoridad.img ? (
                                                <img src={autoridad.img} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                <CircleUserRound className="h-full w-full p-2" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-lg sm:text-xl mb-1">
                                                {autoridad.nombre}
                                            </h4>
                                            <p className="text-gray-600 text-sm sm:text-base">
                                                {autoridad.cargo}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/*Seccion nosotros */}
            <div id="nosotros">
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                NOSOTROS
                            </h2>
                            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                                Conoce más sobre la Secretaría de Cooperación Técnica y Relaciones Internacionales.
                            </p>
                        </div>

                        <Card className="border-2 border-[#0d3b66] shadow-xl rounded-lg overflow-hidden">
                            <CardContent className="p-8 space-y-8">

                                {/* Nuestra Historia */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-[#0d3b66]">
                                    <h3 className="text-2xl font-bold text-[#0d3b66] mb-4 flex items-center">
                                        <Quote className="h-6 w-6 mr-2 text-[#488edf]" />
                                        Nuestra Historia
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        En el mes de Abril de 1991, la actividad de la Secretaría se inicia formalmente a partir de la designación del Secretario, y en el mes de Agosto de 1992, se aprueba su estructura organizacional, creándose definitivamente la&nbsp;Secretaría de Cooperación Técnica, dependiente de Rectorado, y dotándosele de una Dirección y tres Departamentos.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        A partir del año 2010, a través de la Resolución del Consejo Superior <a 
                                            href="https://bo.unsa.edu.ar/cs/R2010/R-CS-2010-0245.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#0d3b66] text-white text-sm rounded-full hover:bg-[#488edf] transition-colors duration-200"
                                        >R-CS-245/10</a> se incluyen actividades de cooperación técnica internacional, abarcando convenios y movilidades.
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

                                {/* Misión */}
                                <div>
                                    <h3 className="text-2xl font-bold text-[#0d3b66] mb-4 flex items-center">
                                        <Globe className="h-6 w-6 mr-2 text-[#488edf]" />
                                        Misión
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        La Secretaría de Cooperación Técnica y Relaciones Internacionales tiene como&nbsp;misión esencial&nbsp;asistir al Consejo Superior y Rectorado en el diseño de las políticas de gestión en las áreas de vinculación, prestación de servicios y cooperación internacional.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mt-4">
                                        En particular, su Misión es la de Programar, promover y mantener las vinculaciones de la Universidad con el medio interno y externo, sea provincial, nacional y/o internacional en la búsqueda de una fluida relación e intercambio de conocimientos con otras instituciones, sean o no de la misma naturaleza, siempre que permita la actualización permanente en el avance del conocimiento y ofrecimiento de los servicios. Todo ello, plasmado en proyectos formalizados a través de Convenios, Protocolos u otra figura legal análoga que vincule a las partes.
                                    </p>
                                </div>

                                {/* Separador visual */}
                                <div className="flex items-center justify-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <div className="mx-4">
                                        <div className="w-3 h-3 bg-[#488edf] rounded-full"></div>
                                    </div>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Funciones */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#0d3b66] mb-4 flex items-center">
                                        <FilePen className="h-6 w-6 mr-2 text-[#488edf]" />
                                        Funciones
                                    </h3>
                                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                                        <li>Oficiar de centro de información interna y externa en materia de prestación de servicios.</li>
                                        <li>Reunir y mantener actualizado un registro de actividades universitarias, susceptibles de ser ofrecido y divulgado en el sector productivo.</li>
                                        <li>Mantener un conocimiento actualizado sobre las actividades económicas de la región e identificar usuarios potenciales.</li>
                                        <li>Recibir demandas del sector productivo y traspasarlas a las Unidades Académicas, motivando su ejecución.</li>
                                        <li>Asesorar y apoyar a las unidades académicas y a sus docentes e investigadores en relación a la prestación de servicios.</li>
                                        <li>Proyectar los modelos de contratos a utilizar.</li>
                                        <li>Actuar como Secretario Ejecutivo del Comité de Asistencia Técnica.</li>
                                        <li>Coordinar las acciones de cooperación internacional de la Universidad con el fin de facilitar su ejecución y evaluación periódica.</li>
                                        <li>Apoyar las iniciativas que surjan desde el seno de la comunidad universitaria, colaborando en la gestión y llevando un registro de los mismos.</li>
                                        <li>Desarrollar planes demandados por las autoridades de la Universidad.</li>
                                        <li>Hacer cumplir las políticas que dicte el Consejo Superior y toda norma que se establezca en materia de cooperación internacional.</li>
                                        <li>Entender en la gestión de los convenios y facilitar su ejecución.</li>
                                        <li>Asistir al Rectorado en todo cuanto se demande para la mayor efectividad en el aprovechamiento de las oportunidades.</li>
                                        <li>Mantener un registro actualizado para la: a) cooperación internacional en cuanto al intercambio académico y b) obtención de fondos (apoyo económico, becas, etc.) a través de la vinculación con organismos provinciales, nacionales e internacionales.</li>
                                        <li>Incentivar la concreción de convenios y el seguimiento de la ejecución de las actividades que se desprendan de los mismos.</li>
                                        <li>Toda tarea encomendada por las autoridades.</li>
                                    </ol>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>

            {/* Contacto */}
            <div id="contacto">
                <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-6">
                            Encuéntranos
                          </h2>
                          <div className="space-y-6">
                            <div className="flex items-start space-x-4 hover:bg-white hover:bg-opacity-50 p-3 rounded-lg transition-all duration-200">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#488edf] to-[#0d3b66] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                <MapPin className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Dirección</h3>
                                <p className="text-gray-600">
                                  Av. Bolivia 5150
                                  <br />
                                  Salta, Argentina
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-4 hover:bg-white hover:bg-opacity-50 p-3 rounded-lg transition-all duration-200">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#488edf] to-[#0d3b66] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Phone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Teléfono</h3>
                                    <p className="text-gray-600">
                                        <a href="tel:+543874255555" className="text-gray-600 hover:text-[#488edf] transition-colors duration-300">
                                            +54 387 425-5555
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 hover:bg-white hover:bg-opacity-50 p-3 rounded-lg transition-all duration-200">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#488edf] to-[#0d3b66] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <WhatsApp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">WhatsApp</h3>
                                    <p className="text-gray-600">
                                        <a href="https://wa.me/543875391627" className="text-gray-600 hover:text-[#488edf] transition-colors duration-300">
                                            +54 387 539-1627
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 hover:bg-white hover:bg-opacity-50 p-3 rounded-lg transition-all duration-200">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#488edf] to-[#0d3b66] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Mail className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Cooperación Técnica</h3>
                                <p className="text-gray-600">
                                    <a href="mailto:ctyri@unsa.edu.ar" className="text-gray-600 hover:text-[#488edf] transition-colors duration-300">
                                        ctyri@unsa.edu.ar
                                    </a>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-4 hover:bg-white hover:bg-opacity-50 p-3 rounded-lg transition-all duration-200">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#488edf] to-[#0d3b66] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Mail className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Relaciones Internacionales</h3>
                                <p className="text-gray-600">
                                    <a href="mailto:coreinte@unsa.edu.ar" className="text-gray-600 hover:text-[#488edf] transition-colors duration-300">
                                        coreinte@unsa.edu.ar
                                    </a>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-[#488edf] to-[#0d3b66] p-1 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <div className="w-full h-96 rounded-xl overflow-hidden">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1077.4178400186115!2d-65.40920124636!3d-24.72731978730781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc11a844315db%3A0xc67e9b83e2b33fb5!2sRECTORADO%2C%20Universidad%20Nacional%20de%20Salta!5e0!3m2!1sen!2sar!4v1756128911272!5m2!1sen!2sar" width="600" height="450" loading="lazy"></iframe>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                </section>
            </div>

            {/*Seccion programas de movilidad */}
            <div id="programas">
                <section className="py-16 bg-white" id='with-animate'>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0d3b66] to-[#488edf] bg-clip-text text-transparent mb-4">
                                PROGRAMAS DE MOVILIDAD
                            </h2>
                            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                                Explora los programas de movilidad que te conectan con el mundo.
                            </p>
                        </div>

                        {/* Separador visual antes de los programas */}
                        <div className="flex items-center justify-center mb-12">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <div className="mx-4">
                                <div className="w-3 h-3 bg-[#0d3b66] rounded-full"></div>
                            </div>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-items-center">
                            {/* Imagen 1 */}
                            <a href="https://www.programapila.lat/" target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                <img src="/images/Logo-Horizontal-scaled-pila-sin-fondo.png" alt="Programa 1" className="h-24 md:h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            {/* Imagen 2 */}
                            <a href="https://www.unsa.edu.ar/" target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                <img src="/images/logo-unsa-azul.png" alt="Programa 2" className="h-24 md:h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            {/* Imagen 3 */}
                            <a href="https://campusglobal.educacion.gob.ar/" target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                <img src="/images/CAMPUS-GLOBAL.png" alt="Programa 3" className="h-24 md:h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            {/* Imagen 4 */}
                            <a href="http://zicosur.co/" target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                <img src="/images/logo-zicosur.png" alt="Programa 4" className="h-24 md:h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            {/* Imagen 5 */}
                            <a href="http://fulbright.edu.ar/" target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                <img src="/images/logo-fulbright.png" alt="Programa 5" className="h-24 md:h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            {/* Imagen 6 */}
                            <a href="https://criscos.unju.edu.ar/" target="_blank" rel="noopener noreferrer" className="group block p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                <img src="/images/CRISCO_1.png" alt="Programa 6" className="h-24 md:h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}