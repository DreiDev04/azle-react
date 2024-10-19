import { Request, Response } from 'express';
import { Deck } from 'Database/entities/deck';
import { User } from 'Database/entities/user';
import { Class } from 'Database/entities/class';
import { Card } from 'Database/entities/card';

export default class DeckController {
    // Create Deck
    static async create_deck(req: Request, res: Response){
        const { deck_name, deck_description, user_id } = req.body;

        try {
            // if (!cards || cards.length < 3) {
            //     return res.status(400).json({ message: 'A deck must contain at least 3 cards.' });
            // }

            const user = await User.findOneBy({ user_id });
            if (!user) {
                throw new Error("User not found");
            }
            // const classes = await Class.findBy(class_ids || []);
            // if (class_ids && classes.length !== class_ids.length) {
            //     throw new Error("One or more classes not found");
            // }
            // if (class_ids.length > 0) {
            //     for (const class_id of class_ids) {
            //         const classEntity = await Class.findOneBy({ class_id });
            //         if (classEntity){
            //             classEntity.class_deckCount += 1;
            //             await classEntity.save();
            //         }   
            //     }
            // }

            const deck = new Deck();
            deck.deck_name = deck_name;
            deck.deck_description = deck_description;
            deck.deck_userOwner = user;
            deck.deck_classEntities = new Array<Class>();

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
          const deck = await Deck.findOne({ where: { deck_id }, relations: ['deck_classEntities'] });
          //console.log(deck);
      
          if (!deck) {
            throw new Error("Deck not found");
          }
      
          // Remove the deck from each associated class
          const classEntities = deck.deck_classEntities;
          for (const classEntity of classEntities) {
            // Decrease the deck count
            if (classEntity.class_deckCount > 0) {
              classEntity.class_deckCount -= 1;
              await classEntity.save(); // Save the changes to the database
            }
          }
      
          // Delete the deck now that it's removed from associated classes
          await deck.remove();
      
          return res.status(200).json({ message: "Deck deleted successfully" });
        } catch (error) {
          console.error(error); // Log the error
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
                where: {deck_userOwner: {user_id: user_id}},
            });
            return res.status(200).json({ message: "Success in fetching decks", payload: user_decks });
        } catch (error) {
            return res.status(400).json({ message: "Error fetching decks", error });
        }
    }

    static async class_decks(req: Request, res: Response){
        const class_id = parseInt(req.params.class_id);

        try {
            const user_decks = await Deck.find({
                where: {deck_classEntities: {class_id: class_id}},
            });
            return res.status(200).json({ message: "Success in fetching decks", payload: user_decks });
        } catch (error) {
            return res.status(400).json({ message: "Error fetching decks", error });
        }
    }

    static async add_deckToClass(req: Request, res: Response){
        const deck_id = parseInt(req.params.deck_id);
        const class_id = parseInt(req.params.class_id);
        console.log(deck_id, class_id);
        try {
            const deck = await Deck.findOneBy({ deck_id });
            if (!deck) {
                throw new Error("Deck not found");
            }
            const classEntity = await Class.findOneBy({ class_id });
            if (!classEntity) {
                throw new Error("Class not found");
            }
            console.log("1");
            deck.deck_classEntities.push(classEntity);
            console.log("2");
            await deck.save();
            console.log("3");
            return res.status(200).json({ message: "Success in adding deck to class" });
        } catch (error) {
            return res.status(400).json({ message: "Error adding deck to class", error })
        }
    }

    static async remove_deckFromClass(req: Request, res: Response){
        const deck_id = parseInt(req.params.deck_id);
        const class_id = parseInt(req.params.class_id);

        try {
            const deck = await Deck.findOneBy({ deck_id });
            if (!deck) {
                throw new Error("Deck not found");
            }
            const classEntity = await Class.findOneBy({ class_id });
            if (!classEntity) {
                throw new Error("Class not found");
            }
            deck.deck_classEntities = deck.deck_classEntities.filter((classEntity) => classEntity.class_id !== class_id);
            await deck.save();
            return res.status(200).json({ message: "Success in removing deck from class" });
        } catch (error) {
            return res.status(400).json({ message: "Error removing deck from class", error })
        }
    }
}

