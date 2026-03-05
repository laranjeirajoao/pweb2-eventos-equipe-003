import { Router } from "express";
import { EventosDatabase } from "../database/EventosDatabase.js";

const router = Router()
const database = new EventosDatabase()

//listar eventos
router.get('/', (req, res) => {
   const { vagasMin } = req.query
   let filteredEventos = database.listarTodos();

   if (vagasMin) {
      filteredEventos = filteredEventos.filter(x => x.vagasDisponiveis >= vagasMin)
   }

   res.json(filteredEventos);
}
)
//Bucar eventos por Id
router.get('/:id', (req, res) => {
   const id = Number(req.params.id);
   const evento = database.buscarPorId(id);

   if (!evento) {
      return res.status(404).json({ mensagem: "Evento não encontrado" });
   }
   res.json(evento);
});

router.post("/:id/inscricao", (req, res) => {
   const id = Number(req.params.id)
   const reduz = database.reduzirVaga(id)
   console.log(reduz);

   if (!reduz) {
      return res.status(500).json({ mensagem: "Evento não possui mais vagas disponíveis!" })
   }
   res.json({ mensagem: "Inscrição realizada com sucesso!" })
})

router.patch("/:id/cancelar", (req, res) => {
   const { id } = req.params
   database.atualizar(Number(id), { ativo: false })
   res.status(204).end()
})

export default router
