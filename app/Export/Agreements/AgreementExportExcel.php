<?php

namespace App\Export\Agreements;

use App\Models\Convenio;
use Maatwebsite\Excel\Concerns\{
    FromQuery,
    WithHeadings,
    WithMapping,
    ShouldAutoSize,
    WithStyles,
    WithEvents
};
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Events\AfterSheet;
use App\Enums\AgreementRenewalEnum;

class AgreementExportExcel implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithEvents
{
    protected array $filters;
    protected string $sort;
    protected string $direction;
    protected int $rowNumber = 0;

    public function __construct(array $filters = [], string $sort = 'date_signature', string $direction = 'desc')
    {
        $this->filters   = $filters;
        $this->sort      = $sort;
        $this->direction = $direction;
    }

    public function query()
    {
        try {
            $validSorts = ['type','title','date_signature','date_end','type_renewal','international','resolution_id'];
            $sort = in_array($this->sort, $validSorts) ? $this->sort : 'date_signature';
            $direction = in_array($this->direction, ['asc','desc']) ? $this->direction : 'desc';

            $query = Agreement::with(['institutions','dependencies','resolution','agreementRenewals','agreementCancellations']);
            
            // Aplicar filtros usando el scope del modelo
            $query = $query->filter($this->filters);
            
            $query = $query->orderBy($sort, $direction);
            
            return $query;
            
        } catch (\Exception $e) {
            return Agreement::with(['institutions','dependencies','resolution'])->orderBy('date_signature', 'desc');
        }
    }

    public function headings(): array
    {
        return [
            'N° de orden',
            'Organización con la que se Conviene',
            'Fecha suscripción',
            'Vigencia hasta',
            'Fecha de Renovación',
            'Unidad/Dependencia interesada',
            'Tipo de Convenio',
            'Objeto',
            'Link',
        ];
    }

    public function map($agreement): array
    {
        try {
            $this->rowNumber++;

            // Manejo seguro de fecha_renovacion_vigente usando el accessor del modelo
            $date_renewal = 'No disponible';
            
            try {
                $date_renewal = $agreement->date_renewal; // Usa el accessor
                if ($date_renewal) {
                    $date_renewal = $date_renewal->format('d-m-Y');
                } else {
                    if ($agreement->type_renewal == AgreementRenewalEnum::Renovable_de_Comun_Acuerdo) {
                        $date_renewal = 'Requiere nuevo acuerdo';
                    } elseif ($agreement->type_renewal == AgreementRenewalEnum::Sin_Renovacion) {
                        $date_renewal = 'No renovable';
                    } else {
                        $date_renewal = 'Pendiente de renovación';
                    }
                }
            } catch (\Exception $e) {
                $date_renewal = 'Error en fecha';
            }

            // Manejo seguro del objeto
            $object = !empty($agreement->object) ? $agreement->object : 'No disponible';

            // Manejo seguro de las relaciones
            $institutions = 'Sin institución';
            if ($agreement->institutions && $agreement->institutions->count() > 0) {
                $names = $agreement->institutions->pluck('name')->filter()->toArray();
                if (!empty($names)) {
                    $institutions = implode(' , ', $names);
                }
            }
            
            $dependencies = 'Sin dependencia';
            if ($agreement->dependencies && $agreement->dependencies->count() > 0) {
                $names = $agreement->dependencies->pluck('name')->filter()->toArray();
                if (!empty($names)) {
                    $dependencies = implode(' , ', $names);
                }
            }

            $link = 'Pendiente de resolución';
            if ($agreement->resolution && !empty($agreement->resolution->link)) {
                $link = $agreement->resolution->link;
            }

            return [
                $this->rowNumber,
                $institutions,
                $agreement->date_signature ? $agreement->date_signature->format('d-m-Y') : '',
                $agreement->date_end ? $agreement->date_end->format('d-m-Y') : '',
                $date_renewal,
                $dependencies,
                $agreement->type ?? '',
                $object,
                $link,
            ];
            
        } catch (\Exception $e) {
            return [
                $this->rowNumber,
                'Error en datos',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ];
        }
    }

    public function styles(Worksheet $sheet)
    {
        try {
            // Estilo del header (fila 1 en lugar de 4)
            $sheet->getStyle('A1:I1')->applyFromArray([
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '0e3b65'],
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error en styles(): ' . $e->getMessage());
        }

        return [];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                try {
                    $sheet = $event->sheet->getDelegate();

                    $rowCount = $sheet->getHighestRow();

                    // En lugar de insertar filas, trabajamos con las existentes
                    // Alternar color de filas (desde la 2 en adelante, ya que la 1 es header)
                    for ($row = 2; $row <= $rowCount; $row++) {
                        $fillColor = $row % 2 == 0 ? 'E6F2FA' : 'FFFFFF'; // celeste claro / blanco
                        
                        try {
                            $sheet->getStyle("A{$row}:I{$row}")->applyFromArray([
                                'fill' => [
                                    'fillType' => Fill::FILL_SOLID,
                                    'startColor' => ['rgb' => $fillColor],
                                ],
                            ]);
                        } catch (\Exception $e) {
                            \Log::error("Error aplicando estilo a fila {$row}: " . $e->getMessage());
                        }
                    }
                    
                } catch (\Exception $e) {
                    \Log::error('Error en registerEvents(): ' . $e->getMessage(), [
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            },
        ];
    }
}