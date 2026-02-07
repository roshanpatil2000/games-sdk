// export const dynamic = 'force-static'


// export async function GET({ params }: { params: { page: string } }) {
//     const page = params.page || 1
//     const res = await fetch("https://feeds.gamepix.com/v2/json?sid=0E766&pagination=12&page=1", {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     })
//     const data = await res.json()

//     return Response.json({ data })
// }



export async function GET() {
    const res = await fetch(
        'https://feeds.gamepix.com/v2/json?sid=0E766&pagination=12&page=1'
    )

    const data = await res.text()

    return new Response(data, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}