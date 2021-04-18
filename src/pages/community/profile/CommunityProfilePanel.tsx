import React, { useState, useEffect, useCallback } from 'react';

import { CommunityProfile } from '../type';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Button from '@/components/button';
import ReactMarkdown from 'react-markdown';

interface CommunityProfileTypeProps {
  profile: CommunityProfile | null;
  visible: boolean;
  onClose: () => void;
}

const defaultProfile: CommunityProfile = {
  essay_id: '',
  user_id: '',
  essay_type: '',
  essay_content: '',
  essay_range: '',
};

export function CommunityProfilePanel(props: CommunityProfileTypeProps) {
  const { profile, onClose } = props;
  const [CurrentTabKey, ChangeCurrentTabKey] = useState('info');

  const [
    CommunityProfile,
    ChangeCommunityProfile,
  ] = useState<CommunityProfile>();

  const dispatch = useDispatch<any>();
  let communityProfile: any = profile ?? defaultProfile;
  const CommunityId = communityProfile.essay_id;

  const ListUserPetsLoading: boolean = useSelector(
    (state: any) => state.loading.effects['info/ListUserPets'],
  );

  const RefreshCommunity = useCallback(() => {
    dispatch({
      type: 'info/GetCommunityProfile',
      payload: {
        essayId: CommunityId,
      },
    }).then((CommunityProfile: CommunityProfile) => {
      if (CommunityProfile instanceof Array) {
        ChangeCommunityProfile(CommunityProfile);
      }
    });
  }, [dispatch, CommunityId]);

  const DeleteCommunity = () => {
    Modal.confirm({
      title: '您确认删除吗？',
      cancelText: '取消',
      okText: '确定',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'info/RemoveCommunity',
          payload: {
            essayId: CommunityId,
          },
        }).then((success: boolean) => {
          if (success) {
            onClose();
          }
        });
      },
    });
  };

  return (
    <>
      <ReactMarkdown source={communityProfile} escapeHtml={false} />
    </>
  );
}
