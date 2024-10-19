import { Request, Response } from 'express';
import { Deck } from 'Database/entities/deck';
import { User } from 'Database/entities/user';
import { Class } from 'Database/entities/class';

export default class DeckController {
    // Create Deck
    static async create_deck(req: Request, res: Response){
        const { deck_name, deck_description, user_id, class_ids } = req.body;

        try {
            // if (!cards || cards.length < 3) {
            //     return res.status(400).json({ message: 'A deck must contain at least 3 cards.' });
            // }

            const user = await User.findOneBy({ user_id });
            if (!user) {
                throw new Error("User not found");
            }
            const classes = await Class.findBy(class_ids || []);
            if (class_ids && classes.length !== class_ids.length) {
                throw new Error("One or more classes not found");
            }
            if (class_ids.length > 0) {
                for (const class_id of class_ids) {
                    const classEntity = await Class.findOneBy({ class_id });
                    if (classEntity){
                        classEntity.deckCount += 1;
                        await classEntity.save();
                    }   
                }
            }

            const deck = new Deck();
            deck.deck_name = deck_name;
            deck.deck_description = deck_description;
            deck.user = user;
            deck.classEntities = classes;

            await Deck.save(deck);

            // const cardPromises = cards.map((cardData: any) => {
            //     const card = new Card();
            //     card.card_answer = cardData.card_answer;
            //     card.card_question = cardData.card_question;
            //     card.deck = deck;
            //     return Card.save(card);
            // });

            // const savedCards = await Promise.all(cardPromises);
            return res.status(200).json({ message: "Success in creating decks", payload: {deck} });
        } catch (error) {
            return res.status(400).json({ message: "Error creating deck", error })
        }
    };

    // Read Deck by ID
    static get_deck = async (req: Request, res: Response) => {
        const deck_id = parseInt(req.params.id);

        try {
            const deck = await Deck.findOneBy({ deck_id});
            if (deck) {
                return res.status(200).json(deck);
            } else {
                return res.status(404).json({ message: "Deck not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error fetching deck", error });
        }
    };

    // Update Deck
    static update_deck = async (req: Request, res: Response) => {
        const deck_id = parseInt(req.params.id);
        const {  user_id, class_ids, ...deckData } = req.body;

        try {
            // if (!cards || cards.length < 3) {
            //     return res.status(400).json({ message: 'A deck must contain at least 3 cards.' });
            // }

            const user = await User.findOneBy({ user_id });
            if (!user) {
                throw new Error("User not found");
            }
            const classes = await Class.findBy(class_ids || []);
            if (class_ids && classes.length !== class_ids.length) {
                throw new Error("One or more classes not found");
            } 

            await Deck.update({deck_id}, {user, classes, ...deckData});

            // const cardPromises = cards.map((cardData: any) => {
            //     const card = new Card();
            //     card.card_answer = cardData.card_answer;
            //     card.card_question = cardData.card_question;
            //     card.deck = deck;
            //     return Card.save(card);
            // });

            // const savedCards = await Promise.all(cardPromises);
            return res.status(200).json({ message: "Success in updating deck" });
        } catch (error) {
            return res.status(400).json({ message: "Error updating deck", error })
        }
    };

    // Delete Deck
    static delete_deck = async (req: Request, res: Response) => {
        const deck_id = parseInt(req.params.id);

        try {
            // Find the deck with its associated classEntities
            const deck = await Deck.findOne({ where: { deck_id }, relations: ['classEntities'] });
            console.log(deck);
            
            if (!deck) {
                throw new Error("Deck not found");
            }
    
            // Remove the deck from each associated class
            const classEntities = deck.classEntities;
            for (const classEntity of classEntities) {
                // Decrease the deck count
                if (classEntity.deckCount > 0) {
                    classEntity.deckCount -= 1;
                    await classEntity.save();
                }
            }
    
            // Delete the deck now that it's removed from associated classes
            await Deck.delete(deck_id);
    
            return res.status(200).json({ message: "Deck deleted successfully" });
        } catch (error) {
            return res.status(400).json({ message: "Error deleting deck", error });
        }
    };

    // Get all Decks
    static async decks(req: Request, res: Response) {
        try {
            const decks = await Deck.find();
            return res.status(200).json(decks);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching decks", error });
        }
    };

    static async user_decks(req: Request, res: Response){
        const user_id = parseInt(req.params.user_id);

        try {
            const user_decks = await Deck.find({
                where: {user: {user_id: user_id}},
            });
            return res.status(200).json({ message: "Success in fetching decks", data: user_decks });
        } catch (error) {
            return res.status(400).json({ message: "Error fetching decks", error });
        }
    }

    static async class_decks(req: Request, res: Response){
        const class_id = parseInt(req.params.class_id);

        try {
            const user_decks = await Deck.find({
                where: {classEntities: {class_id: class_id}},
            });
            return res.status(200).json({ message: "Success in fetching decks", data: user_decks });
        } catch (error) {
            return res.status(400).json({ message: "Error fetching decks", error });
        }
    }
}

