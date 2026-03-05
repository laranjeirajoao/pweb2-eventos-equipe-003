import { Router } from "express";
import { EventosDatabase } from "../database/EventosDatabase.js";

const router = Router()
const database = new EventosDatabase()

//listar eventos
router.get('/', (req, res) => {
   const eventos = db.listarTodos();
   res.json(eventos);
}
)
//Bucar eventos por Id
router.get('/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const evento = db.buscarPorId(id);

   if (!evento) {
      return res.status(404).json({ mensagem: "Evento não encontrado" });
   }
   res.json(evento);
});

router.patch("/:id/cancelar", (req, res) => {
   const { id } = req.params
   database.atualizar(id, { ativo: false })
   res.status(204)
})

export default router
