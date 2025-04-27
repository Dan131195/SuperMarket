import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ProdottoForm = ({
  show,
  handleClose,
  handleSubmit,
  initialData = null,
}) => {
  const [nomeProdotto, setNomeProdotto] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [stock, setStock] = useState("");
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [immagineFile, setImmagineFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setNomeProdotto(initialData.nomeProdotto || "");
      setDescrizione(initialData.descrizioneProdotto || "");
      setPrezzo(initialData.prezzoProdotto || "");
      setStock(initialData.stock || "");
      setNomeCategoria(initialData.categoriaNome || "");
    } else {
      setNomeProdotto("");
      setDescrizione("");
      setPrezzo("");
      setStock("");
      setNomeCategoria("");
      setImmagineFile(null);
    }
  }, [initialData]);

  const onFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("NomeProdotto", nomeProdotto);
    formData.append("DescrizioneProdotto", descrizione);
    formData.append("PrezzoProdotto", parseFloat(prezzo));
    formData.append("Stock", parseInt(stock));
    formData.append("NomeCategoria", nomeCategoria);
    if (immagineFile) formData.append("ImmagineFile", immagineFile);

    handleSubmit(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Modifica Prodotto" : "Crea Nuovo Prodotto"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onFormSubmit} encType="multipart/form-data">
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome Prodotto</Form.Label>
            <Form.Control
              type="text"
              value={nomeProdotto}
              onChange={(e) => setNomeProdotto(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Prezzo</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={prezzo}
              onChange={(e) => setPrezzo(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type="text"
              value={nomeCategoria}
              onChange={(e) => setNomeCategoria(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Immagine</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImmagineFile(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annulla
          </Button>
          <Button variant="success" type="submit">
            {initialData ? "Salva Modifiche" : "Crea"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProdottoForm;
