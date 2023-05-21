import { Router } from 'express';
import * as Company from './controllers/company_controller';
import * as Person from './controllers/person_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

router.post('/companies', async (req, res) => {
  const companyFields = req.body;

  try {
    const result = await Company.createCompany(companyFields);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get('/companies', async (req, res) => {
  try {
    const result = await Company.getCompanies();
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get('/companies/search', async (req, res) => {
  const { q: searchTerm } = req.query;

  try {
    const result = await Company.findCompanies(searchTerm);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get('/companies/:id', async (req, res) => {
  const companyId = req.params.id;

  try {
    const result = await Company.getCompany(companyId);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.put('/companies/:id', async (req, res) => {
  const companyId = req.params.id;
  const companyFields = req.body;

  try {
    const result = await Company.updateCompany(companyId, companyFields);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.delete('/companies/:id', async (req, res) => {
  const companyId = req.params.id;

  try {
    const result = await Company.deleteCompany(companyId);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.post('/people', async (req, res) => {
  const personFields = req.body;

  try {
    const result = await Person.createPerson(personFields);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get('/people', async (req, res) => {
  try {
    const result = await Person.getPeople();
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get('/people/search', async (req, res) => {
  const { q: searchTerm } = req.query;

  try {
    const result = await Person.findPeople(searchTerm);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get('/people/:id', async (req, res) => {
  const personId = req.params.id;

  try {
    const result = await Person.getPerson(personId);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.put('/people/:id', async (req, res) => {
  const personId = req.params.id;
  const personFields = req.body;

  try {
    const result = await Person.updatePerson(personId, personFields);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.delete('/people/:id', async (req, res) => {
  const personId = req.params.id;

  try {
    const result = await Person.deletePerson(personId);
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

export default router;