import React, { useState, useEffect, useCallback } from 'react';

import { SquareProfile } from '../type';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Button from '@/components/button';
import ReactMarkdown from 'react-markdown';

interface SquareProfileTypeProps {
  profile: SquareProfile | null;
  visible: boolean;
  onClose: () => void;
}

const defaultProfile: SquareProfile = {
  essay_id: '',
  user_id: '',
  essay_type: '',
  essay_content: '',
  essay_range: '',
};

export function SquareProfilePanel(props: SquareProfileTypeProps) {
  const { profile, onClose } = props;
  const [CurrentTabKey, ChangeCurrentTabKey] = useState('info');

  const [squareProfileState, ChangeSquareProfile] = useState<SquareProfile>();

  const dispatch = useDispatch<any>();
  let squareProfile: any = profile ?? defaultProfile;
  const SquareId = squareProfile.essay_id;

  const RefreshSquareMoment = useCallback(() => {
    dispatch({
      type: 'square/GetSquareProfile',
      payload: {
        essayId: SquareId,
      },
    }).then((SquareProfile: SquareProfile) => {
      if (SquareProfile instanceof Array) {
        // squareProfile = SquareProfile
      }
    });
  }, [dispatch, SquareId]);

  const DeleteSquare = () => {
    Modal.confirm({
      title: '您确认删除吗？',
      cancelText: '取消',
      okText: '确定',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'square/RemoveSquare',
          payload: {
            essayId: SquareId,
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
      <ReactMarkdown source={squareProfile} escapeHtml={false} />
    </>
  );
}
