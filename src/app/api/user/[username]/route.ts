import { z } from "zod";

const ONLY_VALID_EMAIL = 'JohnDoe@example.com'

const usernameSchema = z.string().min(1).email().refine(v => v === ONLY_VALID_EMAIL, 'Unauthorized user')

const payloadSchema = z.object({
   action: z.enum(['add', 'remove']),
   ammount: z.number().int().positive()
})

export async function POST(req: Request, { params }: { params: { username: string } }) {

   const usernameResult = usernameSchema.safeParse(params.username)
   if (!usernameResult.success) return new Response(JSON.stringify({ message: 'Resource not found' }), { status: 404 })

   let body
   try {
      body = await req.json()
   } catch (error) {
      return new Response(JSON.stringify({ message: 'Invalid JSON' }), { status: 400 })
   }

   const payloadParsingResult = payloadSchema.safeParse(body)
   if (!payloadParsingResult.success) return new Response(JSON.stringify(payloadParsingResult.error.errors[0]), { status: 400 })

   let { action, ammount } = payloadParsingResult.data
   if (action === 'remove') {
      if (ammount > 200) return new Response(JSON.stringify({ message: 'Too big ammount' }), { status: 401 })
      ammount = ammount * 0.9
   }
   return Response.json({
      username: usernameResult.data,
      action,
      ammount
   })
}