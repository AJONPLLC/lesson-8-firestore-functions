import * as functions from 'firebase-functions';

export const bookLikesChange = functions.firestore
  .document('books/{bookId}/likes/{likeId}')
  .onWrite(async change => {
    const countRef = await change.after.ref.parent.doc('counts');
    const countSnap = await countRef.get();

    if (change.after.id === 'counts'){
      console.log('Matching counts');
      return null;
    }

    let increment;
    if (change.after.exists && !change.before.exists) {
      increment = 1;
    } else if (!change.after.exists && change.before.exists) {
      increment = -1;
    } else {
      return null;
    }

    // Return the promise from countRef.transaction() so our function
    // waits for this async event to complete before it exits.
    const data = await countSnap.data();
    if (data) {
      data.likes_count = (data.likes_count || 0) + increment;
      return countRef
        .update(data)
        .then(() => console.log(`Counter updated: ${data.likes_count}`))
        .catch(reason => console.log(reason.message));
    } else {
      const createData = {
        likes_count: 1
      }
      return countRef
      .set(createData)
      .then(() => console.log(`Counter created`))
      .catch(reason => console.log(reason.message));
    }
  });

  export const bookLikesCountDelete = functions.firestore
  .document('books/{bookId}/likes/counts')
  .onDelete(async snap => {
    const counterRef = snap.ref;
    const collectionRef = counterRef.parent;

    return collectionRef.get()
    .then(likes => {
      let size = likes.size;
      if(size < 1){
        size = 0;
      }
      counterRef.set({likes_count: size});
    });
  });
