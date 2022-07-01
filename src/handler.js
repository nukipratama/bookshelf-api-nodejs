import { nanoid } from 'nanoid';
import books from './books.js';

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan'
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id
    }
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (req, h) => {
  let responseData = [];
  const {
    name,
    reading,
    finished
  } = req.query;

  if (name) {
    responseData = books.filter((each) => each.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading === '0' || reading === '1') {
    responseData = books.filter((each) => each.reading === !!+reading);
  }

  if (finished === '0' || finished === '1') {
    responseData = books.filter((each) => each.finished === !!+finished);
  }

  if (responseData.length === 0) responseData = books;

  const response = h.response({
    status: 'success',
    data: {
      books: responseData.map(({ id, name, publisher }) => ({ id, name, publisher }))
    }
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((each) => each.id === id)[0];
  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  return {
    status: 'success',
    data: {
      book
    }
  };
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  const updatedAt = new Date().toISOString();
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  });
  response.code(200);
  return response;
};

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};
