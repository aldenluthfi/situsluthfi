import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode = ['Aceh',
    'Bali',
    'Bangka Belitung',
    'Bengkulu',
    'Banten',
    'Gorontalo',
    'Jambi',
    'Jawa Barat',
    'Jawa Timur',
    'Jakarta Raya',
    'Jawa Tengah',
    'Kalimantan Barat',
    'Kalimantan Timur',
    'Kepulauan Riau',
    'Kalimantan Selatan',
    'Kalimantan Tengah',
    'Kalimantan Utara',
    'Lampung',
    'Maluku',
    'Maluku Utara',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Papua',
    'Papua Barat',
    'Riau',
    'Sulawesi Utara',
    'Sumatera Barat',
    'Sulawesi Tenggara',
    'Sulawesi Selatan',
    'Sulawesi Barat',
    'Sumatera Selatan',
    'Sulawesi Tengah',
    'Sumatera Utara',
    'Yogyakarta',
];

export interface IndonesiaProps extends Omit<MapProps, 'stateCode'> { }

const Indonesia = (props: IndonesiaProps) => {
    return <Map name='Indonesia' stateCode={stateCode} {...props} />;
};

export default Indonesia;
