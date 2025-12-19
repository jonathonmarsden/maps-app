import { redirect } from 'next/navigation';

export default function Home() {
  // Root of maps.jonathonmarsden.com should not render content; it forwards to the main site
  redirect('https://jonathonmarsden.com');
}

