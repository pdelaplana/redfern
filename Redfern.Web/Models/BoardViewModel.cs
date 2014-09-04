using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Redfern.Web.Models
{
    public class CardTagItem
    {
        public int BoardId { get; set; }
        public int CardTagId { get; set; }
        public int CardId { get; set; }
        public int TagId { get; set; }
        public string TagName { get; set; }
    }

    public class CardCommentViewModel
    {
        public int BoardId { get; set; }
        public int CommentId { get; set; }
        public int CardId { get; set; }
        public string Comment {get; set;}
        public string CommentByUser { get; set; }
        public string CommentByUserFullName { get; set; }
        public DateTime CommentDate { get; set; }
    }

    public class CardItem
    {
        public int CardId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int BoardId { get; set; }
        public int ColumnId { get; set; }
        public int Sequence { get; set; }
        public int CardTypeId { get; set; }
        public string CardLabel { get; set; }
        public string Color { get; set; }
        public string CreatedByUserFullName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string AssignedToUser { get; set; }
        public string AssignedToUserFullName { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ArchivedDate { get; set; }
        public bool IsArchived { get; set; }
        public string[] Tags { get; set; }
        public int CommentCount { get; set; }
        public int AttachmentCount { get; set; }
        public int CompletedTaskCount { get; set; }
        public int TotalTaskCount { get; set; }
    }

    public class BoardColumnItem
    {
        public int BoardId { get; set; }
        public int ColumnId { get; set; }
        public string Name { get; set; }
        public int Sequence { get; set; }
        public bool Expanded { get; set; }
        public bool Hidden { get; set; }

        public IList<CardItem> Cards { get; set; }
    }

    public class CardTypeItem
    {
        public int CardTypeId { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
    }

    public class BoardMemberItem 
    {
        public string BoardMemberId { get; set; }
        public int BoardId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }

    public class BoardViewModel
    {
        public int BoardId { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string OwnerFullName { get; set; }
        public DateTime? LastAccessedDate { get; set; }
        public bool IsPublic { get; set; }
        public bool ViewOnly { get; set; }
        public string[] AccessList { get; set; }


        public IList<BoardMemberItem> Members { get; set; }
        public IList<CardTypeItem> CardTypes { get; set; }
        public IList<BoardColumnItem> Columns { get; set; }
    }
}