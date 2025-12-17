import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect the naked subdomain to the main lobby site
  redirect('https://jonathonmarsden.com');
}

