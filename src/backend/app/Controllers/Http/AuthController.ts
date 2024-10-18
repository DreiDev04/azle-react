import { Card } from 'Database/entities/card';
import { Deck } from 'Database/entities/deck';
import { Response, Request } from 'express';

export default class AuthController {
    static async login(request: Request, response: Response){
        const deck_id = parseInt(request.params.deck_id);

        try {
            const deck = await Deck.findOneBy({ deck_id });
            if (!deck) {
                throw new Error("Deck not found.");
            }
            const cards = await Card.find({
                where: { deck: { deck_id } },
            });
    
            if (cards.length === 0) {
                return response.status(404).json({ message: 'No cards found for this deck.' });
            }
    
            response.status(200).json({ message: "Cards found!", payload: cards}); // Return the found cards
        } catch (error) {
            response.status(500).json({ message: error});
        }
    }
    
    
    static async logout(request: Request, response: Response) {
        // if (!request.user) return response.sendStatus(401);
        // request.logout((err) => {
        //     if (err) return response.sendStatus(401);
        //     response.sendStatus(200);
        // });
    };
    
    static async status(request: Request, response: Response){
        // console.log("\nInside /api/auth/status");
        // console.log(request.user);
        // console.log(request.session);
        // console.log(request.sessionID);
        // request.sessionStore.get(request.sessionID, (err, session) => {
        //    console.log(session);
        // });
        // return request.session.user ? response.status(200).send({msg: "Logged in", user: request.session.user}) : response.status(401).send({msg: "Not Authenticated"});
        // return request.user ? response.send(request.user) : response.sendStatus(401);
    };
}