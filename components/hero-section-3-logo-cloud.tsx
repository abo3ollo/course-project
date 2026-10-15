import { Spotify } from '@/components/ui/svgs/spotify'
import { VercelFull } from '@/components/ui/svgs/vercel'
import { SupabaseFull } from '@/components/ui/svgs/supabase'
import { Hulu } from '@/components/ui/svgs/hulu'
import { Bolt } from '@/components/ui/svgs/bolt'
import { Beacon } from '@/components/ui/svgs/beacon'

export const LogoCloud = () => {
    return (
        <div className="**:fill-muted-foreground relative mt-24 flex flex-wrap items-center justify-center gap-8 md:gap-x-16">
            <Bolt
                height={22}
                width={54}
            />
            <VercelFull
                height={22}
                width={84}
            />
            <SupabaseFull className="h-6" />
            <Hulu
                height={18}
                width={56}
            />
            <Spotify
                height={26}
                width={84}
            />
            <Beacon
                height={24}
                width={80}
            />
        </div>
    )
}
