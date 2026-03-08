import { Router } from "express";
import { EventosDatabase } from "../database/EventosDatabase.js";

const router = Router()
const database = new EventosDatabase()

// Listar eventos
router.get('/', (req, res) => {
   const { vagasMin, modalidade, ativo } = req.query
   let filteredEventos = database.listarTodos();

   if (modalidade && modalidade.toLowerCase() !== "presencial" 
       && modalidade.toLowerCase() !== "remoto" 
       && modalidade.toLowerCase() !== "hibrido") {
      return res.status(400).json({ mensagem: "Modalidade inválida! Use: presencial, remoto ou hibrido." });
   }

   if (vagasMin) {
      filteredEventos = filteredEventos.filter(x => x.vagasDisponiveis >= Number(vagasMin))
   }

   if (modalidade) {
      filteredEventos = filteredEventos.filter(x => x.modalidade === modalidade)
   }

   // LISTAR APENAS EVENTOS ATIVOS
   if (ativo === "true") {
      filteredEventos = filteredEventos.filter(x => x.ativo === true)
   }

   res.json(filteredEventos);
})

// Buscar evento por ID
router.get('/:id', (req, res) => {
   const id = Number(req.params.id);
   const evento = database.buscarPorId(id);

   if (!evento) {
      return res.status(404).json({ mensagem: "Evento não encontrado" });
   }

   res.json(evento);
});

// Criar evento
router.post('/', (req, res) => {
   const novoEvento = database.inserir(req.body);
   res.status(201).json(novoEvento);
});

// Atualizar evento
router.put('/:id', (req, res) => {
   const id = Number(req.params.id);

   const eventoAtualizado = database.atualizar(id, req.body);

   if (!eventoAtualizado) {
      return res.status(404).json({ mensagem: "Evento não encontrado" });
   }

   res.json(eventoAtualizado);
});

// Remover evento
router.delete('/:id', (req, res) => {
   const id = Number(req.params.id);

   const removido = database.remover(id);

   if (!removido) {
      return res.status(404).json({ mensagem: "Evento não encontrado" });
   }

   res.status(204).end();
});

// Inscrição em evento
router.post("/:id/inscricao", (req, res) => {
   const id = Number(req.params.id)
   const reduz = database.reduzirVaga(id)

   if (!reduz) {
      return res.status(400).json({ mensagem: "Evento não possui mais vagas disponíveis!" })
   }

   res.json({ mensagem: "Inscrição realizada com sucesso!" })
})

// Cancelar evento
router.patch("/:id/cancelar", (req, res) => {
   const id = Number(req.params.id)

   const evento = database.atualizar(id, { ativo: false })

   if (!evento) {
      return res.status(404).json({ mensagem: "Evento não encontrado" })
   }

   res.status(204).end()
})

export default router
