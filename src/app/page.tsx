import Calendar from '@/sections/Calendar';
import Cover from '@/sections/Cover';
import Gallery from '@/sections/Gallery';
import Letter from '@/sections/Letter';
import Location from '@/sections/Location';

export default function Home() {
  return (
    <div
      className='min-h-screen flex flex-col items-stretch'
      style={{ display: 'contents' }}
    >
      <Cover />
      <Letter />
      <Calendar />
      <Gallery />
      <Location />
    </div>
  );
}
