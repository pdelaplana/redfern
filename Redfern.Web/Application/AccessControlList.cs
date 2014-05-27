using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Application
{
    public enum RedfernAccessType
    {
        
        CreateBoard,
        OpenBoardSettings,
        RenameBoard,
        ArchiveBoard,
        DeleteBoard,
        MakeBoardPublic,

        ViewCollaborators,
        AddColloborators,
        RemoveColloborators,

        RelabelColors,

        FilterCards,

        AddColumn,
        RenameColumn,
        DeleteColumn,
        ShowOrHideColumns,
        OpenColumnProperties,

        RearrangeColumns,

        AddCard,
        OpenCard,
        DeleteCard,
        ArchiveCard,
        AdvanceCardOptions,

        RearrangeCards,

        ChangeCardTitle,
        ChangeCardDescription,
        ChangeCardColor,
        ChangeCardAssignment,
        AddTag,
        RemoveTag,

        ViewComments,
        AddComment,
        DeleteComment,
        DeleteOwnComment,

        ViewHistory,

        ViewAttachments,
        UploadFile,
        DownloadFile,
        DeleteFile,
        DeleteOwnFile


    }

    public static class AccessControlList 
    {

        
        public static RedfernAccessType[] ForOwner
        {
            get
            {
                return new RedfernAccessType[] 
                { 
                    RedfernAccessType.CreateBoard,
                    RedfernAccessType.OpenBoardSettings,
                    RedfernAccessType.RenameBoard,
                    RedfernAccessType.ArchiveBoard,
                    RedfernAccessType.DeleteBoard,
                    RedfernAccessType.MakeBoardPublic,

                    RedfernAccessType.ViewCollaborators,
                    RedfernAccessType.AddColloborators,
                    RedfernAccessType.RemoveColloborators,

                    RedfernAccessType.RelabelColors,

                    RedfernAccessType.FilterCards,

                    RedfernAccessType.AddColumn,
                    RedfernAccessType.RenameColumn,
                    RedfernAccessType.DeleteColumn,
                    RedfernAccessType.ShowOrHideColumns,
                    RedfernAccessType.OpenColumnProperties,

                    RedfernAccessType.RearrangeColumns,

                    RedfernAccessType.AddCard,
                    RedfernAccessType.OpenCard,
                    RedfernAccessType.DeleteCard,
                    RedfernAccessType.ArchiveCard,
                    RedfernAccessType.AdvanceCardOptions,

                    RedfernAccessType.RearrangeCards,

                    RedfernAccessType.ChangeCardTitle,
                    RedfernAccessType.ChangeCardDescription,
                    RedfernAccessType.ChangeCardColor,
                    RedfernAccessType.ChangeCardAssignment,
                    RedfernAccessType.AddTag,
                    RedfernAccessType.RemoveTag,

                    RedfernAccessType.AddComment,
                    RedfernAccessType.DeleteComment,
                    RedfernAccessType.DeleteOwnComment,

                    RedfernAccessType.UploadFile,
                    RedfernAccessType.DownloadFile,
                    RedfernAccessType.DeleteFile,
                    RedfernAccessType.DeleteOwnFile

 
                };
                
            }    
        }

        public static RedfernAccessType[] ForCollaborator
        {
            get
            {
                return new RedfernAccessType[]
                {
                    RedfernAccessType.ViewCollaborators,
                    RedfernAccessType.AddColloborators,
                    
                    RedfernAccessType.RelabelColors,

                    RedfernAccessType.FilterCards,

                    RedfernAccessType.AddColumn,
                    RedfernAccessType.RenameColumn,
                    RedfernAccessType.DeleteColumn,
                    RedfernAccessType.ShowOrHideColumns,
                    RedfernAccessType.OpenColumnProperties,

                    RedfernAccessType.RearrangeColumns,

                    RedfernAccessType.AddCard,
                    RedfernAccessType.OpenCard,
                    RedfernAccessType.DeleteCard,
                    RedfernAccessType.ArchiveCard,
                    RedfernAccessType.AdvanceCardOptions,

                    RedfernAccessType.RearrangeCards,

                    RedfernAccessType.ChangeCardTitle,
                    RedfernAccessType.ChangeCardDescription,
                    RedfernAccessType.ChangeCardColor,
                    RedfernAccessType.ChangeCardAssignment,
                    RedfernAccessType.AddTag,
                    RedfernAccessType.RemoveTag,

                    RedfernAccessType.AddComment,
                    RedfernAccessType.DeleteOwnComment,

                    RedfernAccessType.UploadFile,
                    RedfernAccessType.DownloadFile,
                    RedfernAccessType.DeleteOwnFile,

                    RedfernAccessType.AdvanceCardOptions

                };
            }
        }
        public static RedfernAccessType[] ForViewer
        {
            get
            {
                return new RedfernAccessType[]
                {
                    
                    RedfernAccessType.ViewCollaborators,
                    
                    RedfernAccessType.FilterCards,

                    RedfernAccessType.AddComment,
                    RedfernAccessType.DeleteOwnComment,

                    RedfernAccessType.DownloadFile
                    
                };
            }
        }
    }

}

