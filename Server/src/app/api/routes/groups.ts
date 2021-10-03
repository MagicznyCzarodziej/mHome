import { Router } from 'express';
import { Container } from 'typedi';
import { GroupsRepository } from 'app/repositories/GroupsRepository';

const router = Router();
const groupsRepository = Container.get(GroupsRepository);

router.get('/', async (req, res) => {
  try {
    const groups = await groupsRepository.getAllGroups();
    res.send(groups);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const group = await groupsRepository.getGroup(id);
    res.send(group);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id/elements', async (req, res) => {
  try {
    const groupId = req.params.id;
    const elements = await groupsRepository.getGroupElements(groupId);
    res.send(elements);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as groups };
