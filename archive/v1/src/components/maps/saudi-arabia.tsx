import Map, { type MapProps } from '@/components/maps/generic-map';

export const stateCode = [
    'Ar Riyāḑ',
    'Makkah',
    'Al Madīnah',
    'Ash Sharqīyah',
    'Al Qaşīm',
    "Ḩā'il",
    'Tabūk',
    'Al Ḩudūd ash Shamālīyah',
    'Jīzān',
    'Najrān',
    'Al Bāḩah',
    'Al Jawf',
    "'ٰĀsīr"
];

export interface SaudiArabiaProps extends Omit<MapProps, 'stateCode'> { }

const SaudiArabia = (props: SaudiArabiaProps) => {
    return <Map name='Saudi Arabia' stateCode={stateCode} {...props} />;
};

export default SaudiArabia;
