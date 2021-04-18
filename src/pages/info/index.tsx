import { AppRouteComponentProps } from '@/type';
import React, { useState } from 'react';
import PetsTable from './table/PetsTable';
import CreateUserPanel from './form/CreateUserPanel';
import UserTable from './table/UserTable';
import NewCard, { CardBody } from '@/components/card';
import { PetRecord, UserRecord, UserProfile, PetProfile } from './type.d';
import { GET_IDENTITY } from '@/utils/auth';

export default function (props: AppRouteComponentProps) {
  const [CreateUserVisible, ChangeCreateUserVisible] = useState<boolean>(false);
  const [UserProfileVisible, ChangeUserProfileVisible] = useState<boolean>(
    false,
  );
  const currentUser = GET_IDENTITY();

  const closeCreatePanel = () => {
    ChangeCreateUserVisible(false);
  };
  console.log(currentUser, 'info');

  return (
    <>
      {currentUser === 'admin' ? (
        <>
          <PetsTable />
          <div style={{ margin: 20 }}></div>
          <NewCard>
            <CardBody>
              <UserTable />
            </CardBody>
          </NewCard>
          {CreateUserVisible && (
            <CreateUserPanel
              visible={CreateUserVisible}
              onClose={closeCreatePanel}
            />
          )}
          {/* {UserProfileVisible && UserProfileId} */}
        </>
      ) : (
        <>
          <PetsTable type="petMaster" />
        </>
      )}
    </>
  );
}
