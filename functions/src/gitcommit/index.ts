import * as functions from 'firebase-functions';
import * as nodegit from 'nodegit';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

export const gitReadCommit = functions.firestore
  .document('books/{bookId}')
  .onCreate(async snapshot => {
    const book = snapshot.data();
    const token = functions.config().git.token; //Trying to keep this secret, run firebase functions:config:set git.token=<your_token>
    const repoOwner = 'AJONPLLC';
    const repoName = 'lesson-8-hugo';
    const repoUrl = 'https://github.com/' + repoOwner + '/' + repoName + '.git';
    let debug = 0;
    const opts = {
      fetchOpts: {
        callbacks: {
          certificateCheck: () => {
            // github will fail cert check on some OSX machines
            // this overrides that check
            return 1;
          },
          credentials: (url, userName) => {
             // avoid infinite loop when authentication agent is not loaded
             if (debug++ > 5){
              console.log('Failed too often, bailing.')
              throw new Error("Authentication agent not loaded.");
            }
            return nodegit.Cred.sshKeyFromAgent(userName);
          }
        }
      }
    };

    console.log(book);

    try {
      fse.emptyDirSync(os.tmpdir());
      console.log('Cloning Repo');
      const repo = await nodegit.Clone.clone(repoUrl, os.tmpdir(), opts);
      fse.ensureDirSync(path.join(repo.workdir(), `content/books/`));
      const filePath = path.join(
        repo.workdir(),
        `content/books/`,
        `${book.title}.md`
      );
      console.log('Writing File', filePath);
      fse.writeFileSync(filePath,
`+++
title = "${book.description}"
date = ${new Date().toISOString()}
images = ["https://res.cloudinary.com/ajonp/image/upload/v1545282630/ajonp-ajonp-com/8-lesson-firestore-functions/bookExample.png"]
+++

${book.description}
`
);
      const index = await repo.refreshIndex();
      console.log('Adding to Index:', filePath);
      await index.addByPath(`content/books/${book.title}.md`);
      await index.write();
      const oid = await index.writeTree();
      const head = await nodegit.Reference.nameToId(repo, 'HEAD');
      const parent = await repo.getCommit(head);
      const author = nodegit.Signature.now('ajonp', 'developer@ajonp.com');
      const committer = nodegit.Signature.now('ajonp', 'developer@ajonp.com');
      const commitId = await repo.createCommit(
        'HEAD',
        author,
        committer,
        'message',
        oid,
        [parent]
      );
      console.log('New Commit: ', commitId);
      console.log('Attempting Push');
      const remote = await repo.getRemote('origin');
      return remote.push(['refs/heads/master:refs/heads/master'], {
        callbacks: {
          certificateCheck: () => {
            // github will fail cert check on some OSX machines
            // this overrides that check
            return 1;
          },
          credentials: (url, userName) => {
             // avoid infinite loop when authentication agent is not loaded
             if (debug++ > 5){
              console.log('Failed too often, bailing.')
              throw new Error("Authentication agent not loaded.");
            }
            return nodegit.Cred.sshKeyFromAgent(userName);
          }
        }
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  });
