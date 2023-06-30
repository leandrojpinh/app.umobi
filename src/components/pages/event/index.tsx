import { eventModule as styles }  from '@/styles/pages';
import Image from 'next/image';
import Link from 'next/link';

export function Events() {
    const events = [{
        name: 'Retiro Umobi 2023',
        folder: ''
    }];

    return (
        <div className={styles.events}>
            <strong>Eventos</strong>
            <ul>
                {events.map((event, index) => (
                    <Link key={index} href={'/sign-up'}>
                        <li>
                            <picture>
                                <Image src='/empty-folder.png' alt={event.name} objectPosition={'center'} objectFit='cover' width={120} height={140} />
                            </picture>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}