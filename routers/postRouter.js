const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma')
const authenticateToken = require('../middleware/authenticate-middleware')

// 전체 포스트 조회 (누구나 조회 가능, 작성자 정보도 같이)
router.get('/', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        User: {
          select: {
            userId: true,
            nickname: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return res.status(200).send({
      posts
    })
  } catch (e) {
    console.log(e)
  }
})

// 포스트 생성 (로그인된 유저만 작성 가능)
router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.userId
  
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      userId
    }
  })

  return res.status(200).send({
    message: "새로운 포스트 생성",
    newPost
  })
})

// 특정 포스트 조회 (누구나 조회 가능)
router.get('/:postId', async (req, res) => {
  const postId = Number(req.params.postId);

  const post = await prisma.post.findUnique({
    where: {
      postId
    },
    include: {
      User: {
        select: {
          userId: true,
          nickname: true
        }
      }

    }
  })

  if (!post){
    return res.status(404).send({
      message: "존재하지 않는 포스트"
    })
  }  

  return res.status(200).send({
    post
  })
})

// 포스트 수정 (작성자만 가능)
router.put('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const post = await prisma.post.findUnique({
    where: {
      postId: +postId
    }
  })

  if (!post){
    return res.status(404).send({
      message: "존재하지 않는 포스트"
    })
  }

  const updatedPost = await prisma.post.update({
    where: {
      postId: +postId
    },
    data: {
      title: title ?? post.title,
      content: content ?? post.content
    }
  }
  )

  return res.status(200).send({
    message: "포스트 수정",
    updatedPost
  })
})

// 포스트 삭제 (작성자만 가능)
// hard delete
router.delete('/:postId', async (req, res) => {
  const postId = Number(req.params.postId);

  const post = await prisma.post.findUnique({
    where: {
      postId
    }
  })

  if (!post){
    return res.status(404).send({
      message: "존재하지 않는 포스트"
    })
  }

  await prisma.post.delete({
    where: {
      postId
    }
  })

  return res.status(200).send({
    message: "포스트 삭제"
  })
})

module.exports = router;