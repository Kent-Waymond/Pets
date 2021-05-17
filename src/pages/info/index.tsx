import { AppRouteComponentProps } from '@/type';
import React, { useState, useEffect } from 'react';
import PetsTable from './table/PetsTable';
import CreateUserPanel from './form/CreateUserPanel';
import UserTable from './table/UserTable';
import NewCard, { CardBody } from '@/components/card';
import { PetRecord, UserRecord, UserProfile, PetProfile } from './type.d';
import { GET_IDENTITY } from '@/utils/auth';
import { history } from 'umi';
export default function (props: AppRouteComponentProps) {
  const [CreateUserVisible, ChangeCreateUserVisible] = useState<boolean>(false);
  const [UserProfileVisible, ChangeUserProfileVisible] = useState<boolean>(
    false,
  );
  const [SearchKeyword, ChangeSearchKeyword] = useState('');
  const currentUser = GET_IDENTITY();

  const closeCreatePanel = () => {
    ChangeCreateUserVisible(false);
  };
  // const unlisten = history.listen((location, action) => {
  //   console.log(location?.query?.keywor);
  // });
  const keyword = history.location.query?.keyword;
  return (
    <>
      {currentUser === 'admin' ? (
        <>
          <PetsTable SearchKeyword={keyword ?? ''} />
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
          <PetsTable type="petMaster" SearchKeyword={SearchKeyword ?? ''} />
        </>
      )}
    </>
  );
}
